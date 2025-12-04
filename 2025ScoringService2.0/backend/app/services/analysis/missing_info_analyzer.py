from typing import List, Dict, Any
import re


class MissingInfoAnalyzer:
    """Analyzer for missing information in pitch documents"""
    
    REQUIRED_SECTIONS = {
        "product": {
            "keywords": ["продукт", "product", "решение", "solution", "технология", "technology"],
            "description": "Описание продукта/технологии"
        },
        "team": {
            "keywords": ["команда", "team", "основатель", "founder", "сооснователь", "co-founder"],
            "description": "Информация о команде"
        },
        "finances": {
            "keywords": ["финансы", "finance", "доход", "revenue", "прибыль", "profit", "инвестиции", "investment"],
            "description": "Финансовая информация"
        },
        "market": {
            "keywords": ["рынок", "market", "аудитория", "audience", "целевая группа", "target"],
            "description": "Рыночная информация"
        },
        "business_model": {
            "keywords": ["бизнес-модель", "business model", "монетизация", "monetization", "доходы", "revenue model"],
            "description": "Бизнес-модель"
        },
        "traction": {
            "keywords": ["тракшн", "traction", "пользователи", "users", "клиенты", "clients", "прогресс", "progress"],
            "description": "Тракшн и прогресс"
        },
        "competition": {
            "keywords": ["конкуренты", "competition", "конкуренция", "конкурент", "competitor"],
            "description": "Конкуренты"
        }
    }
    
    def analyze(self, text: str) -> List[Dict[str, Any]]:
        """
        Analyze text for missing information
        
        Args:
            text: Text content to analyze
            
        Returns:
            List of missing information items
        """
        if not text:
            return []
        
        text_lower = text.lower()
        missing_info = []
        
        for section_key, section_info in self.REQUIRED_SECTIONS.items():
            found = False
            for keyword in section_info["keywords"]:
                if keyword in text_lower:
                    found = True
                    break
            
            if not found:
                missing_info.append({
                    "section": section_key,
                    "description": section_info["description"],
                    "recommendation": f"Добавьте информацию о {section_info['description'].lower()}"
                })
        
        return missing_info

