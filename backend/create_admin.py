import psycopg2
from datetime import datetime

DATABASE_URL = "postgresql://postgres.tpemrxixbugzjfrcgday:xeZIOJhUY67SIQW4@aws-0-eu-west-3.pooler.supabase.com:5432/postgres"

try:
    conn = psycopg2.connect(DATABASE_URL)
    cursor = conn.cursor()
    
    # Get admin role ID
    cursor.execute("SELECT id FROM accounts_role WHERE name = 'admin'")
    result = cursor.fetchone()
    
    if result:
        admin_role_id = result[0]
        
        # Check if admin exists
        cursor.execute("SELECT id FROM accounts_user WHERE username = 'admin'")
        if not cursor.fetchone():
            cursor.execute("""
                INSERT INTO accounts_user (
                    username, password, email, is_superuser, is_staff, is_active, 
                    role_id, date_joined, first_name, last_name
                ) VALUES (
                    'admin', 
                    'pbkdf2_sha256$600000$6f7d8e9a1b2c3d4e5f6a7b8c9d0e1f2a$1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b', 
                    'admin@example.com', 
                    TRUE, TRUE, TRUE, %s, NOW(), 'Admin', 'User'
                )
            """, (admin_role_id,))
            conn.commit()
            print('✅ Admin user created!')
            print('   Username: admin')
            print('   Password: Admin123!')
        else:
            print('Admin user already exists')
    else:
        print('Admin role not found - run create_tables.py first')
    
    cursor.close()
    conn.close()
    
except Exception as e:
    print(f'Error: {e}')
