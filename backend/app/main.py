import os
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from .api.routes import router

app = FastAPI(
    title="CentreVision API",
    description="AI-Powered Training Centre Compliance Monitoring Backend (MSDE Problem Statement ID 26245)",
    version="1.0.0"
)

# CORS configuration
origins = os.getenv("CORS_ORIGINS", "*").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins if "*" not in origins else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Exception handler for clean error responses (Section 40)
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"[CentreVision Error] {request.method} {request.url}: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": {
                "code": "SERVER_ERROR",
                "message": "An internal error occurred while processing the request. Graceful fallback active."
            }
        }
    )

# Include API routes
app.include_router(router)

@app.get("/")
def root():
    return {
        "name": "CentreVision API",
        "tagline": "Monitor. Detect. Verify. Act.",
        "ministry": "Ministry of Skill Development and Entrepreneurship (MSDE)",
        "version": "1.0.0",
        "status": "Online",
        "docs": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="127.0.0.1", port=8000, reload=True)
