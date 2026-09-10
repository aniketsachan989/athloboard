import os
import re

file_path = r"c:\Users\ANIKET SACHAN\Codes\Athloboard\android-app\app\src\main\java\com\athloboard\app\data\supabase\SupabaseClient.kt"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Pattern 1: val response = httpClient.newCall(request).execute()\n            val body = response.body?.string() ?: ""\n\n            if (response.isSuccessful) { ... }
# We want to replace it with:
# var responseSuccess = false
# var responseCode = 0
# var errorBody = ""
# httpClient.newCall(request).execute().use { response ->
#    val body = response.body?.string() ?: ""
#    responseSuccess = response.isSuccessful
#    responseCode = response.code
#    errorBody = body
#    if (response.isSuccessful) { ... }
# }

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

content = re.sub(r"val\s+response\s*=\s*httpClient\.newCall\(([^)]+)\)\.execute\(\)\s+val\s+body\s*=\s*response\.body\?\.string\(\)\s*\?\:\s*\"\"", replace_execute, content)

content = content.replace("if (response.isSuccessful) {", "if (responseSuccess) {")
content = content.replace("Result.failure(Exception(\"HTTP error ${response.code}: $body\"))", "Result.failure(Exception(\"HTTP error ${responseCode}: $errorBody\"))")

# also fix the one without body variable if any

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
