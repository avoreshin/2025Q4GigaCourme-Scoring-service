from typing import Dict, List, Any
from sqlalchemy.orm import Session
from app.services.agents.base.mcp_agent import MCPAgent
from app.services.agents.text_analyzer.agent import TextAnalyzerAgent
from app.services.agents.financial_analyzer.agent import FinancialAnalyzerAgent
from app.services.agents.market_analyzer.agent import MarketAnalyzerAgent
from app.services.agents.team_analyzer.agent import TeamAnalyzerAgent
from app.services.agents.risk_predictor.agent import RiskPredictorAgent
import asyncio
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)


class ScoringService:
    """Service for orchestrating scoring agents and calculating final score"""
    
    CATEGORIES = {
        "product_technology": "Product/Technology",
        "market_opportunity": "Market Opportunity",
        "business_model": "Business Model",
        "financials": "Financials",
        "team": "Team",
        "traction": "Traction",
        "competition": "Competition",
        "risk_assessment": "Risk Assessment"
    }
    
    def __init__(self, db: Session):
        self.db = db
        self.agents = {
            "text_analyzer": TextAnalyzerAgent(db),
            "financial_analyzer": FinancialAnalyzerAgent(db),
            "market_analyzer": MarketAnalyzerAgent(db),
            "team_analyzer": TeamAnalyzerAgent(db),
            "risk_predictor": RiskPredictorAgent(db),
        }
    
    def score_startup(self, text: str, startup_id: int) -> Dict[str, Any]:
        """
        Score startup by running all agents
        
        Args:
            text: Pitch document text
            startup_id: Startup ID
            
        Returns:
            Scoring result with total score, breakdown, risks, and recommendations
        """
        logger.info(f"[ScoringService] Starting scoring for startup_id={startup_id}")
        logger.info(f"[ScoringService] Text length: {len(text)} chars")
        
        # Run all agents in parallel (simulated - will be async with MCP)
        results = {}
        for agent_name, agent in self.agents.items():
            try:
                logger.info(f"[ScoringService] Running agent: {agent_name}")
                result = agent.analyze(text)
                logger.info(f"[ScoringService] Agent {agent_name} completed. Result: {result}")
                results[agent_name] = result
            except Exception as e:
                logger.error(f"[ScoringService] Agent {agent_name} failed: {str(e)}", exc_info=True)
                # If agent fails, use default scores
                results[agent_name] = {
                    "score": 50.0,
                    "details": f"Agent error: {str(e)}"
                }
        
        # Calculate breakdown by categories
        breakdown = self._calculate_breakdown(results)
        
        # Calculate total score (weighted average)
        total_score = self._calculate_total_score(breakdown)
        
        # Get top 5 risks
        risks = self._get_top_risks(results)
        
        # Generate recommendations
        recommendations = self._generate_recommendations(breakdown, results)
        
        # Extract team information
        team_info = {}
        if "team_analyzer" in results:
            team_data = results["team_analyzer"]
            team_info = {
                "team_size": team_data.get("team_size", "Не указано"),
                "experience_level": team_data.get("experience_level", 0),
                "key_members": team_data.get("key_members", []),
                "team_strengths": team_data.get("team_strengths", []),
                "details": team_data.get("details", "")
            }
        
        return {
            "total_score": total_score,
            "breakdown": breakdown,
            "risks": risks,
            "recommendations": recommendations,
            "team_info": team_info
        }
    
    def _calculate_breakdown(self, results: Dict[str, Any]) -> Dict[str, float]:
        """Calculate score breakdown by 8 categories"""
        breakdown = {}
        
        # Map agent results to categories
        category_mapping = {
            "product_technology": ["text_analyzer"],
            "market_opportunity": ["market_analyzer"],
            "business_model": ["text_analyzer", "market_analyzer"],
            "financials": ["financial_analyzer"],
            "team": ["team_analyzer"],
            "traction": ["text_analyzer", "market_analyzer"],
            "competition": ["market_analyzer"],
            "risk_assessment": ["risk_predictor"]
        }
        
        for category, agent_names in category_mapping.items():
            scores = []
            for agent_name in agent_names:
                if agent_name in results and "score" in results[agent_name]:
                    scores.append(results[agent_name]["score"])
            
            if scores:
                breakdown[category] = sum(scores) / len(scores)
            else:
                breakdown[category] = 50.0  # Default score
        
        return breakdown
    
    def _calculate_total_score(self, breakdown: Dict[str, float]) -> float:
        """Calculate total score as weighted average"""
        weights = {
            "product_technology": 0.15,
            "market_opportunity": 0.15,
            "business_model": 0.15,
            "financials": 0.15,
            "team": 0.15,
            "traction": 0.10,
            "competition": 0.10,
            "risk_assessment": 0.05
        }
        
        total = sum(breakdown.get(cat, 50.0) * weights.get(cat, 0.125) for cat in breakdown.keys())
        return round(total, 2)
    
    def _get_top_risks(self, results: Dict[str, Any]) -> List[Dict[str, Any]]:
        """Extract top 5 risks from agent results, removing duplicates"""
        risks = []
        seen_descriptions = set()
        
        if "risk_predictor" in results:
            risk_data = results["risk_predictor"]
            if "risks" in risk_data and isinstance(risk_data["risks"], list):
                for risk in risk_data["risks"]:
                    if isinstance(risk, dict) and "description" in risk:
                        desc = risk["description"].strip().lower()
                        if desc not in seen_descriptions:
                            seen_descriptions.add(desc)
                            risks.append(risk)
                            if len(risks) >= 5:
                                break
        
        # If not enough risks, generate from other agents
        if len(risks) < 5:
            for agent_name, result in results.items():
                if agent_name != "risk_predictor" and "risks" in result and isinstance(result["risks"], list):
                    for risk in result["risks"]:
                        if isinstance(risk, dict) and "description" in risk:
                            desc = risk["description"].strip().lower()
                            if desc not in seen_descriptions:
                                seen_descriptions.add(desc)
                                risks.append(risk)
                                if len(risks) >= 5:
                                    break
        
        return risks[:5]
    
    def _generate_recommendations(self, breakdown: Dict[str, float], results: Dict[str, Any]) -> List[str]:
        """Generate recommendations based on weak areas"""
        recommendations = []
        
        # Find categories with low scores
        low_scores = {cat: score for cat, score in breakdown.items() if score < 60}
        
        recommendation_map = {
            "product_technology": "Улучшите описание продукта и технологии",
            "market_opportunity": "Добавьте больше информации о рыночных возможностях",
            "business_model": "Детализируйте бизнес-модель и монетизацию",
            "financials": "Предоставьте больше финансовых данных и прогнозов",
            "team": "Расширьте информацию о команде и опыте",
            "traction": "Покажите больше метрик и прогресса",
            "competition": "Добавьте анализ конкурентов и конкурентных преимуществ",
            "risk_assessment": "Опишите риски и способы их минимизации"
        }
        
        for category in sorted(low_scores.items(), key=lambda x: x[1]):
            if category[0] in recommendation_map:
                recommendations.append(recommendation_map[category[0]])
        
        if not recommendations:
            recommendations.append("Продолжайте развивать все аспекты стартапа")
        
        return recommendations[:5]

