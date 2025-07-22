from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from models import Base, Bathhouse
import os
import json

def init_database():
    """Инициализация базы данных с актуальными банками с Avito"""
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
        # Очищаем таблицу перед добавлением новых данных
        deleted = session.query(Bathhouse).delete()
        print(f'🗑️ Удалено старых записей: {deleted}')
        # Актуальные бани с Avito
        baths = [
            Bathhouse(
                name='Баня Квадро',
                description='Современная баня Квадро. Компактная, уютная, готова к установке.',
                price=295000,
                image='image/banyakvadro.webp',
                tags='баня,квадро',
                specs=json.dumps(['Квадро форма', 'Готова к установке']),
                features=json.dumps(['Современный дизайн', 'Компактность', 'Уют'])
            ),
            Bathhouse(
                name='Крыльцо, ступени',
                description='Крыльцо и ступени для бани. Прочное, удобное, быстрое изготовление.',
                price=7000,
                image='',
                tags='крыльцо,ступени',
                specs=json.dumps(['Прочное исполнение']),
                features=json.dumps(['Удобство', 'Быстрая установка'])
            ),
            Bathhouse(
                name='Гостевой дом/баня квадро/бытовка',
                description='Комбинированное решение: гостевой дом, баня или бытовка. Универсальность и комфорт.',
                price=225000,
                image='image/gostdom.webp',
                tags='дом,баня,квадро,бытовка',
                specs=json.dumps(['Многофункциональный', 'Кедр сибирский']),
                features=json.dumps(['Гостевой дом', 'Баня', 'Бытовка'])
            ),
            Bathhouse(
                name='Баня бочка квадро 4 метра',
                description='Просторная баня-бочка квадро 4 метра. Максимальный комфорт и качество.',
                price=380000,
                image='image/kvadro4m.webp',
                tags='баня,квадро,бочка',
                specs=json.dumps(['4 метра', 'Квадро форма']),
                features=json.dumps(['Просторная', 'Премиум отделка'])
            ),
            Bathhouse(
                name='Баня из кедра 5 метров',
                description='Баня из кедра 5 метров. Экологичность, долговечность, премиум качество.',
                price=435000,
                image='image/iskedra5m.webp',
                tags='баня,кедр',
                specs=json.dumps(['5 метров', 'Кедр']),
                features=json.dumps(['Экологичность', 'Премиум качество'])
            ),
            Bathhouse(
                name='Баня бочка 2 метра',
                description='Компактная баня-бочка 2 метра. Идеальна для небольших участков.',
                price=225000,
                image='',
                tags='баня,бочка',
                specs=json.dumps(['2 метра']),
                features=json.dumps(['Компактность', 'Быстрый прогрев'])
            ),
        ]
        session.add_all(baths)
        session.commit()
        print(f'🎉 База данных обновлена! Добавлено {len(baths)} записей')
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