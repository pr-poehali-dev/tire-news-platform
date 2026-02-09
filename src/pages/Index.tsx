import { useState, useEffect } from 'react';

interface Video {
  id: number;
  title: string;
  thumbnail_url: string;
  duration: string;
  views: string;
  created_at?: string;
}
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [videos, setVideos] = useState<Video[]>([]);
  const [showAdminDialog, setShowAdminDialog] = useState(false);
  const [newVideo, setNewVideo] = useState({ title: '', thumbnail_url: '', duration: '', views: '0' });
  const [isLoading, setIsLoading] = useState(false);

  const API_URL = 'https://functions.poehali.dev/4f2c193a-09ee-4695-b3c5-c1555908e48f';

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setVideos(data.videos || []);
    } catch (error) {
      console.error('Error fetching videos:', error);
    }
  };

  const addVideo = async () => {
    if (!newVideo.title || !newVideo.thumbnail_url || !newVideo.duration) {
      alert('Заполните все обязательные поля');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVideo),
      });
      
      if (response.ok) {
        await fetchVideos();
        setNewVideo({ title: '', thumbnail_url: '', duration: '', views: '0' });
        setShowAdminDialog(false);
      }
    } catch (error) {
      console.error('Error adding video:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteVideo = async (id: number) => {
    if (!confirm('Удалить это видео?')) return;
    
    try {
      const response = await fetch(`${API_URL}?id=${id}`, { method: 'DELETE' });
      if (response.ok) {
        await fetchVideos();
      }
    } catch (error) {
      console.error('Error deleting video:', error);
    }
  };

  const categories = [
    { id: 'all', name: 'Все новости' },
    { id: 'truck', name: 'Грузовые' },
    { id: 'construction', name: 'Спецтехника' },
    { id: 'agricultural', name: 'Сельхоз' },
    { id: 'industrial', name: 'Промышленные' },
  ];

  const news = [
    {
      id: 1,
      title: 'Новая линейка премиальных грузовых шин для дальних перевозок',
      category: 'truck',
      date: '15 января 2026',
      image: 'https://cdn.poehali.dev/projects/077c5817-251b-4cd6-a38e-ac33b3233fc6/files/e722312f-da8f-4cb7-aed7-eda101c0e54d.jpg',
      excerpt: 'Увеличенный ресурс до 450 000 км и снижение расхода топлива на 8%',
    },
    {
      id: 2,
      title: 'Испытания шин для строительной техники в экстремальных условиях',
      category: 'construction',
      date: '12 января 2026',
      image: 'https://cdn.poehali.dev/projects/077c5817-251b-4cd6-a38e-ac33b3233fc6/files/6c17807e-14c6-4203-8b47-9a5e89c7e899.jpg',
      excerpt: 'Результаты тестирования в карьерах показали превосходную износостойкость',
    },
    {
      id: 3,
      title: 'Технология Run-Flat для коммерческого транспорта',
      category: 'truck',
      date: '10 января 2026',
      image: 'https://cdn.poehali.dev/projects/077c5817-251b-4cd6-a38e-ac33b3233fc6/files/3edbe1a0-7598-446e-a826-427f29d5852f.jpg',
      excerpt: 'Инновационное решение позволяет продолжать движение после прокола',
    },
  ];



  const tireComparison = [
    {
      model: 'ProTruck HD-200',
      type: 'Грузовая',
      size: '315/80 R22.5',
      load: '4250 кг',
      speed: '140 км/ч',
      mileage: '450 000 км',
      price: '28 500 ₽',
    },
    {
      model: 'BuildMax X-700',
      type: 'Спецтехника',
      size: '23.5 R25',
      load: '7500 кг',
      speed: '80 км/ч',
      mileage: '8 000 ч',
      price: '185 000 ₽',
    },
    {
      model: 'AgriPro 650',
      type: 'Сельхоз',
      size: '710/70 R42',
      load: '6000 кг',
      speed: '65 км/ч',
      mileage: '6 000 ч',
      price: '165 000 ₽',
    },
  ];

  const filteredNews = selectedCategory === 'all' 
    ? news 
    : news.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Icon name="Cog" size={32} className="text-accent" />
              <div>
                <h1 className="text-2xl font-bold text-primary">TireExpert</h1>
                <p className="text-xs text-muted-foreground">Профессионально о шинах</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-6">
              <a href="#news" className="text-sm font-medium hover:text-accent transition-colors">Новости</a>
              <a href="#articles" className="text-sm font-medium hover:text-accent transition-colors">Статьи</a>
              <a href="#videos" className="text-sm font-medium hover:text-accent transition-colors">Видео</a>
              <a href="#comparison" className="text-sm font-medium hover:text-accent transition-colors">Сравнение</a>
              <a href="#catalog" className="text-sm font-medium hover:text-accent transition-colors">Каталог</a>
              <a href="#about" className="text-sm font-medium hover:text-accent transition-colors">О компании</a>
              <a href="#contacts" className="text-sm font-medium hover:text-accent transition-colors">Контакты</a>
            </nav>
            <div className="hidden md:flex gap-2">
              <Button onClick={() => setShowAdminDialog(true)} variant="outline" size="sm">
                <Icon name="Settings" size={16} className="mr-2" />
                Админ
              </Button>
              <Button>
                Подписаться
              </Button>
            </div>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Icon name="Menu" size={24} />
            </Button>
          </div>
        </div>
      </header>

      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <Badge className="mb-4 bg-accent hover:bg-accent/90">
              Экспертная аналитика
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
              Всё о шинах для коммерческой и специальной техники
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8">
              Актуальные новости, обзоры, тесты и профессиональные рекомендации от экспертов индустрии
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="bg-accent hover:bg-accent/90">
                Смотреть видео
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary">
                Читать статьи
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section id="news" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-primary mb-2">Последние новости</h3>
              <p className="text-muted-foreground">Актуальная информация из мира шинной индустрии</p>
            </div>
            <Button variant="outline">
              Все новости
              <Icon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 mb-8">
            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={selectedCategory === cat.id ? 'default' : 'outline'}
                onClick={() => setSelectedCategory(cat.id)}
                size="sm"
              >
                {cat.name}
              </Button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredNews.map((item) => (
              <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={item.image} 
                    alt={item.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary" className="text-xs">
                      {categories.find(c => c.id === item.category)?.name}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{item.date}</span>
                  </div>
                  <CardTitle className="text-lg hover:text-accent transition-colors">
                    {item.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.excerpt}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="comparison" className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-primary mb-4">Сравнение характеристик шин</h3>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Детальное сравнение технических параметров для профессионального выбора
            </p>
          </div>

          <Card>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-4 font-semibold text-primary">Модель</th>
                      <th className="text-left py-4 px-4 font-semibold text-primary">Тип</th>
                      <th className="text-left py-4 px-4 font-semibold text-primary">Размер</th>
                      <th className="text-left py-4 px-4 font-semibold text-primary">Нагрузка</th>
                      <th className="text-left py-4 px-4 font-semibold text-primary">Скорость</th>
                      <th className="text-left py-4 px-4 font-semibold text-primary">Ресурс</th>
                      <th className="text-left py-4 px-4 font-semibold text-primary">Цена</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tireComparison.map((tire, index) => (
                      <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                        <td className="py-4 px-4 font-medium">{tire.model}</td>
                        <td className="py-4 px-4 text-muted-foreground">{tire.type}</td>
                        <td className="py-4 px-4 text-muted-foreground">{tire.size}</td>
                        <td className="py-4 px-4 text-muted-foreground">{tire.load}</td>
                        <td className="py-4 px-4 text-muted-foreground">{tire.speed}</td>
                        <td className="py-4 px-4 text-muted-foreground">{tire.mileage}</td>
                        <td className="py-4 px-4 font-semibold text-accent">{tire.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-6 flex justify-center">
                <Button>
                  Добавить к сравнению
                  <Icon name="Plus" size={16} className="ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <section id="videos" className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-3xl font-bold text-primary mb-2">Видео обзоры</h3>
              <p className="text-muted-foreground">Экспертные тесты и практические советы</p>
            </div>
            <Button variant="outline">
              Все видео
              <Icon name="ArrowRight" size={16} className="ml-2" />
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {videos.map((video: Video) => (
              <Card key={video.id} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="relative aspect-video overflow-hidden bg-black">
                  <img 
                    src={video.thumbnail_url} 
                    alt={video.title}
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-60 transition-opacity"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon name="Play" size={24} className="text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-4 right-4 bg-black/80 px-2 py-1 rounded text-xs text-white">
                    {video.duration}
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-lg group-hover:text-accent transition-colors">
                    {video.title}
                  </CardTitle>
                  <CardDescription className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Icon name="Eye" size={14} />
                      {video.views} просмотров
                    </span>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteVideo(video.id);
                      }}
                    >
                      <Icon name="Trash2" size={14} className="text-destructive" />
                    </Button>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <Icon name="Mail" size={48} className="mx-auto mb-6 text-accent" />
          <h3 className="text-3xl font-bold mb-4">Подпишитесь на новости</h3>
          <p className="text-lg mb-8 text-primary-foreground/80 max-w-2xl mx-auto">
            Получайте актуальную информацию о новых продуктах, тестах и аналитике
          </p>
          <div className="flex gap-4 max-w-md mx-auto">
            <input 
              type="email" 
              placeholder="Ваш email"
              className="flex-1 px-4 py-3 rounded-md text-foreground"
            />
            <Button size="lg" className="bg-accent hover:bg-accent/90">
              Подписаться
            </Button>
          </div>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Icon name="Cog" size={24} className="text-accent" />
                <span className="font-bold text-lg">TireExpert</span>
              </div>
              <p className="text-sm text-primary-foreground/70">
                Профессиональный портал о шинах для всех видов техники
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Разделы</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li><a href="#news" className="hover:text-accent transition-colors">Новости</a></li>
                <li><a href="#articles" className="hover:text-accent transition-colors">Статьи</a></li>
                <li><a href="#videos" className="hover:text-accent transition-colors">Видео</a></li>
                <li><a href="#catalog" className="hover:text-accent transition-colors">Каталог</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Информация</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li><a href="#about" className="hover:text-accent transition-colors">О компании</a></li>
                <li><a href="#contacts" className="hover:text-accent transition-colors">Контакты</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Реклама</a></li>
                <li><a href="#" className="hover:text-accent transition-colors">Партнерам</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Контакты</h4>
              <ul className="space-y-2 text-sm text-primary-foreground/70">
                <li className="flex items-center gap-2">
                  <Icon name="Mail" size={16} />
                  info@tireexpert.ru
                </li>
                <li className="flex items-center gap-2">
                  <Icon name="Phone" size={16} />
                  +7 (495) 123-45-67
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary-foreground/20 mt-8 pt-8 text-center text-sm text-primary-foreground/60">
            © 2026 TireExpert. Все права защищены.
          </div>
        </div>
      </footer>

      {showAdminDialog && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md animate-scale-in">
            <CardHeader>
              <CardTitle>Добавить видео</CardTitle>
              <CardDescription>Заполните информацию о новом видео</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Название *</label>
                <input
                  type="text"
                  placeholder="Тест-драйв новых шин"
                  value={newVideo.title}
                  onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">URL миниатюры *</label>
                <input
                  type="text"
                  placeholder="https://example.com/image.jpg"
                  value={newVideo.thumbnail_url}
                  onChange={(e) => setNewVideo({ ...newVideo, thumbnail_url: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Длительность *</label>
                <input
                  type="text"
                  placeholder="10:30"
                  value={newVideo.duration}
                  onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Просмотры</label>
                <input
                  type="text"
                  placeholder="1.2K"
                  value={newVideo.views}
                  onChange={(e) => setNewVideo({ ...newVideo, views: e.target.value })}
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>
              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={addVideo} 
                  disabled={isLoading}
                  className="flex-1"
                >
                  {isLoading ? 'Добавление...' : 'Добавить'}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowAdminDialog(false)}
                  className="flex-1"
                >
                  Отмена
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Index;