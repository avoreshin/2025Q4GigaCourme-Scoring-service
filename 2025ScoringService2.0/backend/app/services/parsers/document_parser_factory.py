from app.services.parsers.base_parser import DocumentParser
from app.services.parsers.pdf_parser import PDFParser
from app.services.parsers.markdown_parser import MarkdownParser
from app.services.parsers.presentation_parser import PresentationParser
from app.services.parsers.url_parser import URLParser
from app.services.parsers.text_parser import TextParser


class DocumentParserFactory:
    """Factory for creating document parsers"""
    
    _parsers = {
        'pdf': PDFParser,
        'md': MarkdownParser,
        'markdown': MarkdownParser,
        'pptx': PresentationParser,
        'ppt': PresentationParser,
        'url': URLParser,
        'text': TextParser,
        'txt': TextParser,
    }
    
    @classmethod
    def get_parser(cls, content_type: str) -> DocumentParser:
        """
        Get parser for content type
        
        Args:
            content_type: File extension or content type identifier
            
        Returns:
            DocumentParser instance
        """
        content_type = content_type.lower()
        parser_class = cls._parsers.get(content_type)
        
        if not parser_class:
            # Default to text parser
            parser_class = TextParser
        
        return parser_class()

