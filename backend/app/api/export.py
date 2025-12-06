from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse, StreamingResponse
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models import Scoring
from app.services.export.export_service import ExportService
import io

router = APIRouter(prefix="/api/scorings", tags=["export"])


@router.get("/{scoring_id}/export/pdf")
def export_pdf(scoring_id: int, db: Session = Depends(get_db)):
    """Export scoring report as PDF"""
    scoring = db.query(Scoring).filter(Scoring.id == scoring_id).first()
    if not scoring:
        raise HTTPException(status_code=404, detail="Scoring not found")
    
    export_service = ExportService()
    pdf_bytes = export_service.export_to_pdf(scoring)
    
    return StreamingResponse(
        io.BytesIO(pdf_bytes),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=scoring_{scoring_id}.pdf"}
    )


@router.get("/{scoring_id}/export/excel")
def export_excel(scoring_id: int, db: Session = Depends(get_db)):
    """Export scoring report as Excel"""
    scoring = db.query(Scoring).filter(Scoring.id == scoring_id).first()
    if not scoring:
        raise HTTPException(status_code=404, detail="Scoring not found")
    
    export_service = ExportService()
    excel_bytes = export_service.export_to_excel(scoring)
    
    return StreamingResponse(
        io.BytesIO(excel_bytes),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=scoring_{scoring_id}.xlsx"}
    )

