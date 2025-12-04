from app.services.parsers.base_parser import DocumentParser


class MarkdownParser(DocumentParser):
    """Parser for Markdown files"""
    
    def parse(self, source: str) -> str:
        """Read Markdown file content"""
        try:
            with open(source, 'r', encoding='utf-8') as file:
                return file.read()
        except Exception as e:
            raise ValueError(f"Failed to parse Markdown: {str(e)}")

