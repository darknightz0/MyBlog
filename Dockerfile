FROM mcr.microsoft.com/dotnet/sdk:8.0

WORKDIR /app

# 複製並還原
COPY *.csproj ./
RUN dotnet restore

# 複製其餘內容並建置
COPY . ./
RUN dotnet publish -c Release -o out

# 切換工作目錄到輸出
WORKDIR /app/out

# 執行
ENTRYPOINT ["dotnet", "MyBlog.dll"]
