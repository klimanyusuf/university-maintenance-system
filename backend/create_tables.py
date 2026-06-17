import psycopg2
import os

DATABASE_URL = "postgresql://postgres.tpemrxixbugzjfrcgday:xeZIOJhUY67SIQW4@aws-0-eu-west-3.pooler.supabase.com:5432/postgres"

def create_tables():
    try:
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        print("Creating tables in Supabase...")
        
        # Create Role table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS accounts_role (
                id SERIAL PRIMARY KEY,
                name VARCHAR(20) NOT NULL UNIQUE,
                description TEXT,
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        """)
        print("  ✓ Created accounts_role table")
        
        # Create User table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS accounts_user (
                id SERIAL PRIMARY KEY,
                password VARCHAR(128) NOT NULL,
                last_login TIMESTAMP WITH TIME ZONE,
                is_superuser BOOLEAN NOT NULL DEFAULT FALSE,
                username VARCHAR(150) NOT NULL UNIQUE,
                first_name VARCHAR(150) NOT NULL DEFAULT '',
                last_name VARCHAR(150) NOT NULL DEFAULT '',
                email VARCHAR(254) NOT NULL DEFAULT '',
                is_staff BOOLEAN NOT NULL DEFAULT FALSE,
                is_active BOOLEAN NOT NULL DEFAULT TRUE,
                date_joined TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
                phone_number VARCHAR(15) NOT NULL DEFAULT '',
                department VARCHAR(100) NOT NULL DEFAULT '',
                role_id INTEGER REFERENCES accounts_role(id),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        """)
        print("  ✓ Created accounts_user table")
        
        # Create Category table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS requests_category (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL UNIQUE,
                description TEXT,
                icon VARCHAR(50),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
        """)
        print("  ✓ Created requests_category table")
        
        # Create ServiceRequest table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS requests_servicerequest (
                id SERIAL PRIMARY KEY,
                title VARCHAR(200) NOT NULL,
                description TEXT NOT NULL,
                priority VARCHAR(10) NOT NULL DEFAULT 'medium',
                status VARCHAR(20) NOT NULL DEFAULT 'pending',
                building VARCHAR(100) DEFAULT '',
                room_number VARCHAR(20) DEFAULT '',
                images JSONB DEFAULT '[]',
                requester_id INTEGER NOT NULL REFERENCES accounts_user(id),
                assigned_to_id INTEGER REFERENCES accounts_user(id),
                category_id INTEGER REFERENCES requests_category(id),
                created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
                completed_at TIMESTAMP WITH TIME ZONE,
                rating INTEGER,
                feedback TEXT
            );
        """)
        print("  ✓ Created requests_servicerequest table")
        
        # Insert default roles
        cursor.execute("""
            INSERT INTO accounts_role (name) VALUES ('admin'), ('officer'), ('student'), ('staff')
            ON CONFLICT (name) DO NOTHING;
        """)
        print("  ✓ Inserted default roles")
        
        # Insert default categories
        cursor.execute("""
            INSERT INTO requests_category (name) VALUES 
                ('Electricity'), ('Plumbing'), ('Furniture'), 
                ('Internet'), ('Cleaning'), ('HVAC'), ('Building')
            ON CONFLICT (name) DO NOTHING;
        """)
        print("  ✓ Inserted default categories")
        
        conn.commit()
        cursor.close()
        conn.close()
        
        print("\n✅ All tables created successfully!")
        
    except Exception as e:
        print(f'Error: {e}')

if __name__ == "__main__":
    create_tables()
