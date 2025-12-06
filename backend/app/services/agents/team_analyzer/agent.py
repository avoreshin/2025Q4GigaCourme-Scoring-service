from typing import Dict, Any
from sqlalchemy.orm import Session
from app.services.agents.base.mcp_agent import MCPAgent
import json


class TeamAnalyzerAgent(MCPAgent):
    """Agent for analyzing team"""
    
    def __init__(self, db: Session):
        super().__init__(db, "team_analyzer")
    
    def analyze(self, text: str) -> Dict[str, Any]:
        """Analyze team information"""
        prompt_template = self.config["prompts"].get(
            "analysis_prompt",
            f"""Analyze the team information in the following startup pitch.
            
Text:
{{text}}

Provide a JSON response with:
- score: float (0-100) - team analysis score
- team_size: string - team size assessment
- experience_level: float (0-100) - team experience score
- key_members: list - list of key team members identified
- team_strengths: list - list of team strengths
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
                "team_size": result.get("team_size", "Not specified"),
                "experience_level": result.get("experience_level", 50.0),
                "key_members": result.get("key_members", []),
                "team_strengths": result.get("team_strengths", []),
                "details": result.get("details", "Analysis completed")
            }
        except json.JSONDecodeError:
            return {
                "score": 50.0,
                "team_size": "Not specified",
                "experience_level": 50.0,
                "key_members": [],
                "team_strengths": [],
                "details": "Analysis completed with default scores"
            }

