from sqlalchemy import Column, Integer, String, Text, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import json

Base = declarative_base()

class Bathhouse(Base):
    __tablename__ = 'bathhouses'
    
    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(Integer, nullable=False)
    image = Column(String(500))
    tags = Column(String(500))  # Теги через запятую
    specs = Column(Text)        # JSON строка со спецификациями
    features = Column(Text)     # JSON строка с особенностями
    
    def __repr__(self):
        return f"<Bathhouse(id={self.id}, name='{self.name}', price={self.price})>"
    
    def specs_list(self) -> list:
        """Возвращает спецификации как список"""
        try:
            if isinstance(self.specs, str):
                return json.loads(self.specs or "[]")
            return []
        except (json.JSONDecodeError, TypeError):
            return []
    
    def features_list(self) -> list:
        """Возвращает особенности как список"""
        try:
            if isinstance(self.features, str):
                return json.loads(self.features or "[]")
            return []
        except (json.JSONDecodeError, TypeError):
            return []
    
    @property
    def tags_list(self):
        """Возвращает теги как список"""
        if isinstance(self.tags, str) and len(self.tags) > 0:
            return [tag.strip() for tag in self.tags.split(',') if tag.strip()]
        return []
    
    def to_dict(self):
        """Преобразует объект в словарь для API"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'price': self.price,
            'image': self.image,
            'tags': self.tags,
            'specs': self.specs_list(),
            'features': self.features_list()
        }