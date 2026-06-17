from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
from django.utils import timezone
from django.contrib.auth import get_user_model
from .models import ServiceRequest, Category
from .serializers import ServiceRequestSerializer, CategorySerializer
import csv
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle
from reportlab.lib import colors

User = get_user_model()

class ServiceRequestViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceRequestSerializer
    permission_classes = [IsAuthenticated]
    queryset = ServiceRequest.objects.all()

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return ServiceRequest.objects.none()
        role_name = user.role.name if user.role else None
        if role_name == 'admin':
            return ServiceRequest.objects.all()
        elif role_name == 'officer':
            from django.db.models import Q
            return ServiceRequest.objects.filter(Q(assigned_to=user) | Q(status='pending'))
        else:
            return ServiceRequest.objects.filter(requester=user)

    def perform_create(self, serializer):
        try:
            serializer.save(requester=self.request.user)
        except Exception as e:
            from rest_framework.exceptions import ValidationError
            raise ValidationError({'error': str(e)})

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def assign(self, request, pk=None):
        try:
            request_obj = self.get_object()
            if request.user.role is None:
                return Response({'error': 'User has no role assigned'}, status=400)
            if request.user.role.name != 'admin':
                return Response({'error': 'Only admins can assign'}, status=403)
            officer_id = request.data.get('officer_id')
            if not officer_id:
                return Response({'error': 'officer_id is required'}, status=400)
            officer = User.objects.get(id=officer_id, role__name='officer')
            request_obj.assigned_to = officer
            request_obj.status = 'assigned'
            request_obj.save()
            from apps.assignments.models import Assignment
            Assignment.objects.create(
                request=request_obj,
                assigned_by=request.user,
                assigned_to=officer,
                notes=request.data.get('notes', '')
            )
            from apps.notifications.models import Notification
            Notification.objects.create(
                recipient=officer,
                title='Request Assigned',
                message=f'Request #{request_obj.id}: {request_obj.title} has been assigned to you.'
            )
            return Response({'message': 'Request assigned successfully'})
        except Exception as e:
            import traceback
            return Response({'error': str(e), 'traceback': traceback.format_exc()}, status=500)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated])
    def complete(self, request, pk=None):
        try:
            request_obj = self.get_object()
            if request_obj.assigned_to != request.user and request.user.role.name != 'admin':
                return Response({'error': 'Only assigned officer or admin can complete'}, status=403)
            request_obj.status = 'completed'
            request_obj.completed_at = timezone.now()
            request_obj.completion_notes = request.data.get('notes', '')
            request_obj.save()
            from apps.notifications.models import Notification
            Notification.objects.create(
                recipient=request_obj.requester,
                title='Request Completed',
                message=f'Your request #{request_obj.id}: {request_obj.title} has been completed.'
            )
            return Response({'message': 'Request completed successfully'})
        except Exception as e:
            import traceback
            return Response({'error': str(e), 'traceback': traceback.format_exc()}, status=500)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def export_csv(self, request):
        queryset = self.get_queryset()
        response = HttpResponse(content_type='text/csv')
        response['Content-Disposition'] = 'attachment; filename="requests.csv"'
        writer = csv.writer(response)
        writer.writerow(['ID', 'Title', 'Status', 'Priority', 'Requester', 'Created At'])
        for req in queryset:
            writer.writerow([req.id, req.title, req.status, req.priority, req.requester.username, req.created_at])
        return response

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated])
    def export_pdf(self, request):
        queryset = self.get_queryset()
        response = HttpResponse(content_type='application/pdf')
        response['Content-Disposition'] = 'attachment; filename="requests.pdf"'
        doc = SimpleDocTemplate(response, pagesize=letter)
        elements = []
        data = [['ID', 'Title', 'Status', 'Priority', 'Requester', 'Created At']]
        for req in queryset[:50]:
            data.append([str(req.id), req.title, req.status, req.priority, req.requester.username, str(req.created_at.date())])
        table = Table(data)
        table.setStyle(TableStyle([
            ('BACKGROUND', (0,0), (-1,0), colors.grey),
            ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
            ('ALIGN', (0,0), (-1,-1), 'CENTER'),
            ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
            ('FONTSIZE', (0,0), (-1,0), 12),
            ('BOTTOMPADDING', (0,0), (-1,0), 12),
            ('BACKGROUND', (0,1), (-1,-1), colors.beige),
            ('GRID', (0,0), (-1,-1), 1, colors.black),
        ]))
        elements.append(table)
        doc.build(elements)
        return response

class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    serializer_class = CategorySerializer
    permission_classes = [IsAuthenticated]
    queryset = Category.objects.all()
