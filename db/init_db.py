from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Bathhouse
import os
import json

def init_database():
    """Инициализация базы данных с актуальными банками с Avito"""
    # Путь к базе данных
    DB_PATH = os.path.join(os.path.dirname(__file__), 'baths.db')
    
    print(f"🔧 Используется путь к БД: {DB_PATH}")
    
    # Создание подключения
    engine = create_engine(f'sqlite:///{DB_PATH}', echo=False)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        # Удаляем все таблицы и создаем заново для гарантии
        Base.metadata.drop_all(engine)
        Base.metadata.create_all(engine)
        print('✅ Таблицы пересозданы')
        
        # Проверяем, что таблица пуста
        count_before = session.query(Bathhouse).count()
        print(f'📊 Записей до очистки: {count_before}')
        
        # Актуальные бани с Avito
        baths = [
            Bathhouse(
                name='Баня Квадро',
                description='Современная баня Квадро. Компактная, уютная, готова к установке.',
                price=295000,
                image='image/banyakvadro.webp',
                tags='баня,квадро',
                specs=json.dumps(['Квадро форма', 'Готова к установке'], ensure_ascii=False),
                features=json.dumps(['Современный дизайн', 'Компактность', 'Уют'], ensure_ascii=False)
            ),
            Bathhouse(
                name='Гостевой дом/баня квадро/бытовка',
                description='Комбинированное решение: гостевой дом, баня или бытовка. Универсальность и комфорт.',
                price=225000,
                image='image/gostdom.webp',
                tags='дом,баня,квадро,бытовка',
                specs=json.dumps(['Многофункциональный', 'Кедр сибирский'], ensure_ascii=False),
                features=json.dumps(['Гостевой дом', 'Баня', 'Бытовка'], ensure_ascii=False)
            ),
            Bathhouse(
                name='Баня бочка квадро 4 метра',
                description='Просторная баня-бочка квадро 4 метра. Максимальный комфорт и качество.',
                price=380000,
                image='image/kvadro4m.webp',
                tags='баня,квадро,бочка',
                specs=json.dumps(['4 метра', 'Квадро форма'], ensure_ascii=False),
                features=json.dumps(['Просторная', 'Премиум отделка'], ensure_ascii=False)
            ),
            Bathhouse(
                name='Баня из кедра 5 метров',
                description='Баня из кедра 5 метров. Экологичность, долговечность, премиум качество.',
                price=435000,
                image='image/iskedra5m.webp',
                tags='баня,кедр',
                specs=json.dumps(['5 метров', 'Кедр'], ensure_ascii=False),
                features=json.dumps(['Экологичность', 'Премиум качество'], ensure_ascii=False)
            ),
            Bathhouse(
                name='Баня бочка 2 метра',
                description='Компактная баня-бочка 2 метра. Идеальна для небольших участков.',
                price=225000,
                image='image/1.P_8UZra4kxYiz1ETZjpT_m_HkRCqxxEeYsKRFKTPmxyi.webp',
                tags='баня,бочка',
                specs=json.dumps(['2 метра'], ensure_ascii=False),
                features=json.dumps(['Компактность', 'Быстрый прогрев'], ensure_ascii=False)
            ),
        ]
        
        # Добавляем записи одну за другой с проверкой
        for i, bath in enumerate(baths, 1):
            session.add(bath)
            print(f'➕ Добавлена баня {i}: {bath.name}')
        
        # Коммитим изменения
        session.commit()
        print(f'🎉 База данных обновлена! Добавлено {len(baths)} записей')
        
        # Финальная проверка
        total_count = session.query(Bathhouse).count()
        print(f'📊 Всего записей в базе после обновления: {total_count}')
        
        if total_count != len(baths):
            print(f'⚠️ ВНИМАНИЕ: Ожидалось {len(baths)} записей, но в базе {total_count}')
        
    except Exception as e:
        print(f'❌ Ошибка при инициализации БД: {e}')
        session.rollback()
        raise
    finally:
        session.close()

def check_database():
    """Проверка содержимого базы данных"""
    DB_PATH = os.path.join(os.path.dirname(__file__), 'baths.db')
    
    if not os.path.exists(DB_PATH):
        print(f'❌ Файл базы данных не найден: {DB_PATH}')
        return
    
    print(f'🔍 Проверяем базу данных: {DB_PATH}')
    
    engine = create_engine(f'sqlite:///{DB_PATH}', echo=False)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    try:
        print('\n📋 Текущее содержимое таблицы bathhouses:')
        print('=' * 80)
        
        baths = session.query(Bathhouse).all()
        
        if not baths:
            print('🔍 Таблица пуста!')
            return
        
        for bath in baths:
            print(f"ID: {bath.id}")
            print(f"Name: {bath.name}")
            print(f"Price: {bath.price:,} ₽")
            print(f"Image: {bath.image}")
            print(f"Tags: {bath.tags}")
            print(f"Description: {bath.description[:50]}...")
            print(f"Specs: {bath.specs_list()}")
            print(f"Features: {bath.features_list()}")
            print('-' * 80)
            
    except Exception as e:
        print(f'❌ Ошибка при проверке БД: {e}')
    finally:
        session.close()

def force_recreate_database():
    """Принудительное пересоздание базы данных"""
    DB_PATH = os.path.join(os.path.dirname(__file__), 'baths.db')
    
    print(f'🔥 Принудительное пересоздание базы данных: {DB_PATH}')
    
    # Удаляем файл базы данных если он существует
    if os.path.exists(DB_PATH):
        os.remove(DB_PATH)
        print('🗑️ Старый файл базы данных удален')
    
    # Создаем новую базу
    init_database()

if __name__ == '__main__':
    print("Выберите действие:")
    print("1. Обычное обновление базы данных")
    print("2. Принудительное пересоздание базы данных")
    print("3. Только проверка содержимого")
    
    choice = input("Введите номер (1-3): ").strip()
    
    if choice == '1':
        init_database()
        check_database()
    elif choice == '2':
        force_recreate_database()
        check_database()
    elif choice == '3':
        check_database()
    else:
        print("Неверный выбор. Выполняется обычное обновление...")
        init_database()
        check_database()
