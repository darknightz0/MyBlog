# 運行階段映像
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 80

# 建置階段映像
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# 複製 csproj 並還原套件
COPY ["MyBlog.csproj", "./"]
RUN dotnet restore "MyBlog.csproj"

# 複製所有檔案並建置
COPY . .
RUN dotnet publish "MyBlog.csproj" -c Release -o /app/publish

# 發佈階段
FROM base AS final
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "MyBlog.dll"]