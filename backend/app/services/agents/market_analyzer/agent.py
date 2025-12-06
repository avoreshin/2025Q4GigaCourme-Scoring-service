from typing import Dict, Any
from sqlalchemy.orm import Session
from app.services.agents.base.mcp_agent import MCPAgent
import json


class MarketAnalyzerAgent(MCPAgent):
    """Agent for analyzing market and competition"""
    
    def __init__(self, db: Session):
        super().__init__(db, "market_analyzer")
    
    def analyze(self, text: str) -> Dict[str, Any]:
        """Analyze market opportunity and competition"""
        prompt_template = self.config["prompts"].get(
            "analysis_prompt",
            f"""Analyze the market opportunity and competition in the following startup pitch.
            
Text:
{{text}}

Provide a JSON response with:
- score: float (0-100) - market analysis score
- market_size: string - assessment of market size
- competition_level: string - level of competition
- competitive_advantages: list - list of competitive advantages
- market_opportunity: float (0-100) - market opportunity score
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
                "market_size": result.get("market_size", "Not specified"),
                "competition_level": result.get("competition_level", "Unknown"),
                "competitive_advantages": result.get("competitive_advantages", []),
                "market_opportunity": result.get("market_opportunity", 50.0),
                "details": result.get("details", "Analysis completed")
            }
        except json.JSONDecodeError:
            return {
                "score": 50.0,
                "market_size": "Not specified",
                "competition_level": "Unknown",
                "competitive_advantages": [],
                "market_opportunity": 50.0,
                "details": "Analysis completed with default scores"
            }

