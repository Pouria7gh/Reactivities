FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build-env
WORKDIR /app

# copy .csproj and restore as distinct layers
COPY "Reactivities.sln" "Reactivities.sln"
COPY "API/API.csproj" "API/API.csproj"
COPY "Application/Application.csproj" "Application/Application.csproj"
COPY "Domain/Domain.csproj" "Domain/Domain.csproj"
COPY "Infrastructure/Infrastructure.csproj" "Infrastructure/Infrastructure.csproj"
COPY "Presistence/Presistence.csproj" "Presistence/Presistence.csproj"

RUN dotnet restore "Reactivities.sln"

# copy everything else build 
COPY . .
WORKDIR /app
RUN dotnet publish -c Release -o out

# build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app
COPY --from=build-env /app/out .
ENTRYPOINT [ "dotnet", "API.dll" ]