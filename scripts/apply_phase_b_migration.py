import psycopg2
import sys

# Database connection string (direct connection, not pooler)
conn_string = "postgresql://postgres.vkmddiwsrcpqfilmfqfd:Clave2025@aws-0-us-east-1.pooler.supabase.com:5432/postgres"

# Read the migration file
migration_path = r"d:\franco lenovo\Franco\GESTIÓN DOCENTE\asistente-docente\supabase\migrations\20260217_add_4to_5to_secundaria.sql"

try:
    # Connect to the database
    print("Connecting to database...")
    conn = psycopg2.connect(conn_string)
    conn.autocommit = False
    cursor = conn.cursor()
    
    # Read the SQL file
    print(f"Reading migration file: {migration_path}")
    with open(migration_path, 'r', encoding='utf-8') as f:
        sql_content = f.read()
    
    # Execute the entire SQL content
    print("Executing migration...")
    cursor.execute(sql_content)
    
    # Commit the transaction
    conn.commit()
    print("Migration committed successfully!")
    
    # Verify the results
    print("\nVerifying results...")
    cursor.execute("""
        SELECT g.nombre, COUNT(d.id) as count
        FROM grados g
        LEFT JOIN desempenos d ON g.id = d.grado_id
        WHERE g.nombre IN ('4° Secundaria', '5° Secundaria')
        GROUP BY g.nombre
        ORDER BY g.nombre
    """)
    
    results = cursor.fetchall()
    for row in results:
        print(f"{row[0]}: {row[1]} desempeños")
    
    cursor.close()
    conn.close()
    print("\nMigration completed successfully!")
    
except Exception as e:
    print(f"Error: {e}")
    if 'conn' in locals():
        conn.rollback()
        conn.close()
    sys.exit(1)
