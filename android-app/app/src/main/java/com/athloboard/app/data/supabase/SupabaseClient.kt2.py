import os
import re

file_path = r"c:\Users\ANIKET SACHAN\Codes\Athloboard\android-app\app\src\main\java\com\athloboard\app\data\supabase\SupabaseClient.kt"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

def replace_execute(match):
    req_var = match.group(1)
    return f"""var responseSuccess = false
            var responseCode = 0
            var errorBody = ""

            httpClient.newCall({req_var}).execute().use {{ response ->
                val body = response.body?.string() ?: ""
                responseSuccess = response.isSuccessful
                responseCode = response.code
                errorBody = body"""

# match `val response = httpClient.newCall(request).execute()` ... `val body = response.body?.string() ?: ""`
content = re.sub(r"val\s+response\s*=\s*httpClient\.newCall\(([^)]+)\)\.execute\(\)\s*val\s+body\s*=\s*response\.body\?\.string\(\)\s*\?\:\s*\"\"", replace_execute, content)

# just basic replace for remaining ones
content = re.sub(r"val\s+response\s*=\s*httpClient\.newCall\(([^)]+)\)\.execute\(\)", r"httpClient.newCall(\1).execute().use { response ->", content)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
