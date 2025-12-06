from typing import Dict, Any
from sqlalchemy.orm import Session
from app.services.agents.base.mcp_agent import MCPAgent
import json


class FinancialAnalyzerAgent(MCPAgent):
    """Agent for analyzing financial data"""
    
    def __init__(self, db: Session):
        super().__init__(db, "financial_analyzer")
    
    def analyze(self, text: str) -> Dict[str, Any]:
        """Analyze financial information"""
        prompt_template = self.config["prompts"].get(
            "analysis_prompt",
            f"""Analyze the financial information in the following startup pitch.
            
Text:
{{text}}

Provide a JSON response with:
- score: float (0-100) - financial analysis score
- revenue_model: string - description of revenue model
- financial_health: float (0-100) - assessment of financial health
- funding_needs: string - identified funding needs
- details: string - brief analysis summary

Return only valid JSON."""
        )
        # Format prompt with actual text
        prompt = prompt_template.format(text=text)
        
        response = self._call_mcp(prompt)
        
        try:
            result = json.loads(response)
            return {
                "score": result.get("score", 50.0),
                "revenue_model": result.get("revenue_model", "Not specified"),
                "financial_health": result.get("financial_health", 50.0),
                "funding_needs": result.get("funding_needs", "Not specified"),
                "details": result.get("details", "Analysis completed")
            }
        except json.JSONDecodeError:
            return {
                "score": 50.0,
                "revenue_model": "Not specified",
                "financial_health": 50.0,
                "funding_needs": "Not specified",
                "details": "Analysis completed with default scores"
            }

