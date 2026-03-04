import requests
import json

# Supabase configuration
project_url = "https://vkmddiwsrcpqfilmfqfd.supabase.co"
service_role_key = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbWRkaXdzcmNwcWZpbG1mcWZkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczODgzNDQ3MywiZXhwIjoyMDU0NDEwNDczfQ.Ry-mGJMqPOhxbHhzqWrJVGHKJMhZJqZGQqBMWxdPxGU"

# Read the SQL file
sql_file = r"d:\franco lenovo\Franco\GESTIÓN DOCENTE\asistente-docente\supabase\migrations\20260217_add_4to_5to_secundaria.sql"

print("Reading SQL file...")
with open(sql_file, 'r', encoding='utf-8') as f:
    sql_content = f.read()

# Execute SQL using Supabase REST API
print("Executing SQL migration...")
url = f"{project_url}/rest/v1/rpc/exec_sql"
headers = {
    "apikey": service_role_key,
    "Authorization": f"Bearer {service_role_key}",
    "Content-Type": "application/json"
}

# Try to execute the SQL
try:
    response = requests.post(
        f"{project_url}/rest/v1/rpc/exec_sql",
        headers=headers,
        json={"query": sql_content}
    )
    
    if response.status_code == 200:
        print("✓ Migration executed successfully!")
        print(response.text)
    else:
        print(f"✗ Error: {response.status_code}")
        print(response.text)
        
        # Try alternative: execute via SQL endpoint
        print("\nTrying alternative method...")
        # Split into individual INSERT statements
        statements = []
        current = ""
        for line in sql_content.split('\n'):
            if line.strip() and not line.strip().startswith('--'):
                current += line + '\n'
                if ';' in line:
                    statements.append(current.strip())
                    current = ""
        
        print(f"Found {len(statements)} SQL statements")
        
        # Execute each statement
        success_count = 0
        for i, stmt in enumerate(statements, 1):
            try:
                resp = requests.post(
                    f"{project_url}/rest/v1/rpc/exec_sql",
                    headers=headers,
                    json={"query": stmt}
                )
                if resp.status_code == 200:
                    success_count += 1
                    if i % 10 == 0:
                        print(f"Executed {i}/{len(statements)}...")
                else:
                    print(f"Error on statement {i}: {resp.text[:100]}")
            except Exception as e:
                print(f"Exception on statement {i}: {str(e)[:100]}")
        
        print(f"\nCompleted: {success_count}/{len(statements)} statements executed")
        
except Exception as e:
    print(f"Error: {e}")

print("\nVerifying results...")
# Verify the count
verify_url = f"{project_url}/rest/v1/desempenos?select=grado_id&grado_id=in.(select id from grados where nombre in ('4° Secundaria','5° Secundaria'))"
response = requests.get(verify_url, headers=headers)
if response.status_code == 200:
    count = len(response.json())
    print(f"Total desempeños for 4° and 5° Secundaria: {count}")
else:
    print(f"Could not verify: {response.status_code}")
