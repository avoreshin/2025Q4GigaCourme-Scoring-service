from typing import Dict, Any
from sqlalchemy.orm import Session
from app.services.agents.base.mcp_agent import MCPAgent
import json


class RiskPredictorAgent(MCPAgent):
    """Agent for predicting risks"""
    
    def __init__(self, db: Session):
        super().__init__(db, "risk_predictor")
    
    def analyze(self, text: str) -> Dict[str, Any]:
        """Predict risks"""
        prompt_template = self.config["prompts"].get(
            "analysis_prompt",
            f"""Analyze and predict risks for the following startup pitch.
            
Text:
{{text}}

Provide a JSON response with:
- score: float (0-100) - risk assessment score (higher = lower risk)
- risks: list - list of risk objects, each with:
  - description: string - risk description
  - probability: float (0-1) - probability of risk
  - impact: string - impact level (low/medium/high)
  - mitigation: string - suggested mitigation
- overall_risk_level: string - overall risk level (low/medium/high)
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
                "risks": result.get("risks", []),
                "overall_risk_level": result.get("overall_risk_level", "medium"),
                "details": result.get("details", "Analysis completed")
            }
        except json.JSONDecodeError:
            return {
                "score": 50.0,
                "risks": [],
                "overall_risk_level": "medium",
                "details": "Analysis completed with default scores"
            }

