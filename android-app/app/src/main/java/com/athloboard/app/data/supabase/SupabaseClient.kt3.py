import re

file_path = r"c:\Users\ANIKET SACHAN\Codes\Athloboard\android-app\app\src\main\java\com\athloboard\app\data\supabase\SupabaseClient.kt"

with open(file_path, "r", encoding="utf-8") as f:
    content = f.read()

# Replace:
# val response = httpClient.newCall(request).execute()
# Result.success(response.isSuccessful)
content = re.sub(
    r"val response = httpClient\.newCall\(([^)]+)\)\.execute\(\)\s*Result\.success\(response\.isSuccessful\)",
    r"httpClient.newCall(\1).execute().use { response ->\n                return@withContext Result.success(response.isSuccessful)\n            }",
    content
)

# Replace:
# val response = httpClient.newCall(request).execute()
# if (response.isSuccessful) Result.success(true)
# else Result.failure(Exception("HTTP error ${response.code}"))
content = re.sub(
    r"val response = httpClient\.newCall\(([^)]+)\)\.execute\(\)\s*if\s*\(response\.isSuccessful\)\s*Result\.success\(true\)\s*else\s*Result\.failure\(Exception\(\"HTTP error \$\{response\.code\}\"\)\)",
    r"httpClient.newCall(\1).execute().use { response ->\n                if (response.isSuccessful) return@withContext Result.success(true)\n                else return@withContext Result.failure(Exception(\"HTTP error ${response.code}\"))\n            }",
    content
)

with open(file_path, "w", encoding="utf-8") as f:
    f.write(content)
print("done")
