from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Bathhouse
import os
import json

def init_database():
    """Инициализация базы данных с примерами бань"""
    
    # Путь к базе данных
    DB_PATH = os.path.join(os.path.dirname(__file__), 'baths.db')
    
    # Создание подключения
    engine = create_engine(f'sqlite:///{DB_PATH}', echo=False)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # Создание таблиц
        Base.metadata.create_all(engine)
        print('✅ Таблицы созданы/проверены')
        
        # Проверяем, есть ли уже данные
        existing_count = session.query(Bathhouse).count()
        if existing_count > 0:
            print(f'📊 База уже содержит {existing_count} записей')
            return
        
        # Примеры бань
        baths = [
            Bathhouse(
                name='Беседка Квадро',
                description='Уникальная форма. Просторная площадь. Надежная конструкция. Быстрая установка. Уют и комфорт для семьи.',
                price=125000,
                image='image/besedkakvadro.webp',
                tags='беседка,квадро',
                specs=json.dumps(['Квадро форма', 'Кедр сибирский', 'Качественная сборка']),
                features=json.dumps(['Уникальная форма', 'Просторная площадь', 'Надежная конструкция', 'Быстрая установка', 'Уют и комфорт для семьи'])
            ),
            Bathhouse(
                name='Баня Квадро в наличии',
                description='Уникальный дизайн. Просторная парилка. Отдельная моечная. Готова к установке. Тепло и здоровье для релакса.',
                price=280000,
                image='image/banyakvadro.webp',
                tags='баня,квадро',
                specs=json.dumps(['Квадро форма', 'Кедр сибирский', 'Готова к установке']),
                features=json.dumps(['Уникальный дизайн', 'Просторная парилка', 'Отдельная моечная', 'Готова к установке', 'Тепло и здоровье для релакса'])
            ),
            Bathhouse(
                name='Гостевой дом/баня квадро/бытовка',
                description='Комбинированное решение. Баня + гостевой дом. Экономия места. Универсальность. Индивидуальность и традиции семьи.',
                price=225000,
                image='image/gostdom.webp',
                tags='дом,баня,квадро',
                specs=json.dumps(['Многофункциональный', 'Кедр сибирский', 'Гостевой дом + баня']),
                features=json.dumps(['Комбинированное решение', 'Баня + гостевой дом', 'Экономия места', 'Универсальность', 'Индивидуальность и традиции семьи'])
            ),
            Bathhouse(
                name='Баня бочка квадро 4 метра',
                description='Просторная баня-бочка. Уникальная квадро форма. Максимальный комфорт. Премиум отделка. Мастерство и качество исполнения.',
                price=200000,
                image='image/kvadro4m.webp',
                tags='баня,квадро',
                specs=json.dumps(['4 метра', 'Квадро форма', 'Кедр сибирский']),
                features=json.dumps(['Просторная баня-бочка', 'Уникальная квадро форма', 'Максимальный комфорт', 'Премиум отделка', 'Мастерство и качество исполнения'])
            ),
            # Добавим еще несколько для разнообразия
            Bathhouse(
                name='Баня-бочка классическая 3м',
                description='Традиционная баня-бочка. Компактный размер. Идеальна для небольших участков. Быстрый прогрев.',
                price=150000,
                image='image/classic3m.webp',
                tags='баня,классика',
                specs=json.dumps(['3 метра', 'Классическая форма', 'Кедр сибирский']),
                features=json.dumps(['Традиционная форма', 'Компактный размер', 'Быстрый прогрев', 'Экономия места'])
            ),
            Bathhouse(
                name='Баня-бочка с террасой',
                description='Баня с открытой террасой. Место для отдыха. Красивый дизайн. Функциональность и комфорт.',
                price=320000,
                image='image/terrace.webp',
                tags='баня,терраса',
                specs=json.dumps(['С террасой', 'Кедр сибирский', 'Расширенная площадь']),
                features=json.dumps(['Открытая терраса', 'Место для отдыха', 'Красивый дизайн', 'Функциональность'])
            )
        ]
        
        # Добавляем данные
        session.add_all(baths)
        session.commit()
        print(f'🎉 База данных инициализирована! Добавлено {len(baths)} записей')
        
        # Проверяем что данные добавились
        total_count = session.query(Bathhouse).count()
        print(f'📊 Всего записей в базе: {total_count}')
        
    except Exception as e:
        print(f'❌ Ошибка при инициализации БД: {e}')
        session.rollback()
        raise
    finally:
        session.close()

def check_database():
    """Проверка содержимого базы данных"""
    DB_PATH = os.path.join(os.path.dirname(__file__), 'baths.db')
    engine = create_engine(f'sqlite:///{DB_PATH}', echo=False)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        print('\n📋 Текущее содержимое таблицы bathhouses:')
        print('-' * 80)
        
        for bath in session.query(Bathhouse).all():
            print(f"ID: {bath.id}")
            print(f"Name: {bath.name}")
            print(f"Price: {bath.price:,} ₽")
            print(f"Image: {bath.image}")
            print(f"Tags: {bath.tags}")
            print(f"Description: {bath.description[:50]}...")
            print('-' * 80)
            
    except Exception as e:
        print(f'❌ Ошибка при проверке БД: {e}')
    finally:
        session.close()

if __name__ == '__main__':
    init_database()
    check_database()