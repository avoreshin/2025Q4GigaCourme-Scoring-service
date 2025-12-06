from app.services.parsers.base_parser import DocumentParser


class TextParser(DocumentParser):
    """Parser for plain text files"""
    
    def parse(self, source: str) -> str:
        """Read text file content"""
        try:
            with open(source, 'r', encoding='utf-8') as file:
                return file.read()
        except Exception as e:
            raise ValueError(f"Failed to parse text file: {str(e)}")

