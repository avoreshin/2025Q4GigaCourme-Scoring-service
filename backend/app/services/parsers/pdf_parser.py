from app.services.parsers.base_parser import DocumentParser
import PyPDF2
import pdfplumber


class PDFParser(DocumentParser):
    """Parser for PDF files"""
    
    def parse(self, source: str) -> str:
        """Extract text from PDF file"""
        text_parts = []
        
        # Try pdfplumber first (better for complex PDFs)
        try:
            with pdfplumber.open(source) as pdf:
                for page in pdf.pages:
                    text = page.extract_text()
                    if text:
                        text_parts.append(text)
        except Exception:
            # Fallback to PyPDF2
            try:
                with open(source, 'rb') as file:
                    pdf_reader = PyPDF2.PdfReader(file)
                    for page in pdf_reader.pages:
                        text = page.extract_text()
                        if text:
                            text_parts.append(text)
            except Exception as e:
                raise ValueError(f"Failed to parse PDF: {str(e)}")
        
        return "\n\n".join(text_parts)

