import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const API_URL = 'https://functions.poehali.dev/f4f852f7-e6d5-4e79-9132-b96fddbf828b';

interface Rim {
  id: number;
  brand: string;
  model: string;
  diameter: number;
  width: number;
  pcd: string;
  et: number;
  dia: number;
  color: string;
  material: string;
  price: number;
  in_stock: boolean;
  image_url: string;
}

interface Filters {
  brands: string[];
  diameters: number[];
  pcds: string[];
  widths: number[];
}

interface Selected {
  brand: string;
  diameter: string;
  pcd: string;
  width: string;
  in_stock: boolean;
}

export default function WheelRimSelector() {
  const [filters, setFilters] = useState<Filters>({ brands: [], diameters: [], pcds: [], widths: [] });
  const [rims, setRims] = useState<Rim[]>([]);
  const [total, setTotal] = useState(0);
  const [selected, setSelected] = useState<Selected>({ brand: '', diameter: '', pcd: '', width: '', in_stock: false });
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  useEffect(() => {
    fetch(`${API_URL}?action=filters`)
      .then(r => r.json())
      .then(setFilters)
      .catch(console.error);
  }, []);

  const search = useCallback(async () => {
    setLoading(true);
    setSearched(true);
    const params = new URLSearchParams();
    if (selected.brand) params.set('brand', selected.brand);
    if (selected.diameter) params.set('diameter', selected.diameter);
    if (selected.pcd) params.set('pcd', selected.pcd);
    if (selected.width) params.set('width', selected.width);
    if (selected.in_stock) params.set('in_stock', 'true');

    try {
      const res = await fetch(`${API_URL}?${params}`);
      const data = await res.json();
      setRims(data.rims || []);
      setTotal(data.total || 0);
    } finally {
      setLoading(false);
    }
  }, [selected]);

  const reset = () => {
    setSelected({ brand: '', diameter: '', pcd: '', width: '', in_stock: false });
    setRims([]);
    setSearched(false);
  };

  const hasFilters = filters.brands.length > 0 || filters.diameters.length > 0;

  return (
    <section id="rim-selector" className="py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h3 className="text-3xl font-bold text-primary mb-3">Подбор колесных дисков</h3>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Выберите параметры и найдите подходящие диски из нашего каталога
          </p>
        </div>

        {!hasFilters ? (
          <Card className="max-w-lg mx-auto">
            <CardContent className="py-12 text-center">
              <Icon name="CircleOff" size={48} className="text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg font-medium">Каталог пуст</p>
              <p className="text-muted-foreground text-sm mt-2">Загрузите базу дисков через раздел «Админ»</p>
            </CardContent>
          </Card>
        ) : (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Icon name="SlidersHorizontal" size={20} />
                  Параметры подбора
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="text-sm font-medium mb-2 block text-muted-foreground">Бренд</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                      value={selected.brand}
                      onChange={e => setSelected(s => ({ ...s, brand: e.target.value }))}
                    >
                      <option value="">Все бренды</option>
                      {filters.brands.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block text-muted-foreground">Диаметр (R)</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                      value={selected.diameter}
                      onChange={e => setSelected(s => ({ ...s, diameter: e.target.value }))}
                    >
                      <option value="">Любой</option>
                      {filters.diameters.map(d => <option key={d} value={d}>R{d}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block text-muted-foreground">PCD (сверловка)</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                      value={selected.pcd}
                      onChange={e => setSelected(s => ({ ...s, pcd: e.target.value }))}
                    >
                      <option value="">Любой</option>
                      {filters.pcds.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium mb-2 block text-muted-foreground">Ширина (J)</label>
                    <select
                      className="w-full px-3 py-2 border rounded-md bg-background text-sm"
                      value={selected.width}
                      onChange={e => setSelected(s => ({ ...s, width: e.target.value }))}
                    >
                      <option value="">Любая</option>
                      {filters.widths.map(w => <option key={w} value={w}>{w}J</option>)}
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={selected.in_stock}
                      onChange={e => setSelected(s => ({ ...s, in_stock: e.target.checked }))}
                      className="w-4 h-4 accent-accent"
                    />
                    <span className="text-sm font-medium">Только в наличии</span>
                  </label>

                  <div className="flex gap-3">
                    <Button variant="outline" onClick={reset} size="sm">
                      <Icon name="RotateCcw" size={14} className="mr-2" />
                      Сбросить
                    </Button>
                    <Button onClick={search} disabled={loading}>
                      {loading ? (
                        <>
                          <Icon name="Loader" size={16} className="mr-2 animate-spin" />
                          Поиск...
                        </>
                      ) : (
                        <>
                          <Icon name="Search" size={16} className="mr-2" />
                          Найти диски
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {searched && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-muted-foreground">
                    Найдено: <span className="font-semibold text-foreground">{total}</span> позиций
                  </p>
                </div>

                {rims.length === 0 ? (
                  <Card>
                    <CardContent className="py-12 text-center">
                      <Icon name="SearchX" size={48} className="text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">По выбранным параметрам ничего не найдено</p>
                      <Button variant="outline" className="mt-4" onClick={reset}>Сбросить фильтры</Button>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {rims.map(rim => (
                      <Card key={rim.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                        {rim.image_url ? (
                          <div className="aspect-square overflow-hidden bg-muted">
                            <img src={rim.image_url} alt={`${rim.brand} ${rim.model}`} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="aspect-square bg-muted flex items-center justify-center">
                            <Icon name="CircleDot" size={48} className="text-muted-foreground/40" />
                          </div>
                        )}
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <p className="font-bold text-primary">{rim.brand}</p>
                              <p className="text-sm text-muted-foreground">{rim.model}</p>
                            </div>
                            <Badge variant={rim.in_stock ? 'default' : 'secondary'} className="text-xs shrink-0">
                              {rim.in_stock ? 'В наличии' : 'Под заказ'}
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs text-muted-foreground mt-3 mb-4">
                            {rim.diameter && <span>R{rim.diameter}</span>}
                            {rim.width && <span>{rim.width}J</span>}
                            {rim.pcd && <span>PCD {rim.pcd}</span>}
                            {rim.et !== null && rim.et !== undefined && <span>ET{rim.et}</span>}
                            {rim.dia && <span>DIA {rim.dia}</span>}
                            {rim.color && <span>{rim.color}</span>}
                            {rim.material && <span>{rim.material}</span>}
                          </div>

                          {rim.price && (
                            <p className="text-lg font-bold text-accent">
                              {Number(rim.price).toLocaleString('ru-RU')} ₽
                            </p>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
