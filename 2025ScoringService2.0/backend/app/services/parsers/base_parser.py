from abc import ABC, abstractmethod


class DocumentParser(ABC):
    """Base class for document parsers"""
    
    @abstractmethod
    def parse(self, source: str) -> str:
        """
        Parse document and extract text
        
        Args:
            source: File path or URL
            
        Returns:
            Extracted text content
        """
        pass

