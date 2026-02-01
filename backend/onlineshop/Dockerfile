FROM python:3.11-slim

# Set the working directory inside the container
WORKDIR /app

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose port 8000
EXPOSE 8000

ENTRYPOINT [ "sh", "run.sh" ]
