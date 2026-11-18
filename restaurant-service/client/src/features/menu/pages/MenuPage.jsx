import { useEffect, useMemo, useState } from 'react';
import { ImageOff, Plus, UtensilsCrossed } from 'lucide-react';
import { toast } from 'sonner';
import { Layout } from '../../../shared/components/Layout.jsx';
import { PageHeader } from '../../../shared/components/ui/PageHeader.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Badge } from '../../../shared/components/ui/Badge.jsx';
import { Sheet } from '../../../shared/components/ui/Sheet.jsx';
import { TableCard } from '../../../shared/components/ui/TableCard.jsx';
import { RowActions } from '../../../shared/components/ui/RowActions.jsx';
import { SearchField, Toolbar } from '../../../shared/components/ui/SearchField.jsx';
import { Field, Input, Select, Textarea } from '../../../shared/components/ui/Field.jsx';
import { ImageDropzone } from '../../../shared/components/ui/ImageDropzone.jsx';
import { confirmAction } from '../../../shared/lib/confirm.js';
import { formatMoney, entityId, restaurantName } from '../../../shared/lib/format.js';
import { MENU_CATEGORY } from '../../../shared/lib/status.js';
import { getAllRestaurants } from '../../../shared/api/restaurantApi.js';
import { getAllMenuItems, createMenuItem, updateMenuItem, deleteMenuItem, uploadMenuImage } from '../../../shared/api/menuApi.js';

const FORM_ID = 'menu-form';
const EMPTY = { restaurantId: '', name: '', description: '', price: '', category: '', imageUrl: '' };

export const MenuPage = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [restaurantsLoading, setRestaurantsLoading] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [menuError, setMenuError] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [formData, setFormData] = useState(EMPTY);

  useEffect(() => {
    loadRestaurants();
    loadMenuItems();
  }, []);

  const loadRestaurants = async () => {
    try {
      setRestaurantsLoading(true);
      const data = await getAllRestaurants();
      setRestaurants(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('No se pudieron cargar los restaurantes');
      console.error(error);
    } finally {
      setRestaurantsLoading(false);
    }
  };

  const loadMenuItems = async () => {
    try {
      setLoading(true);
      const data = await getAllMenuItems();
      setMenuItems(Array.isArray(data) ? data : []);
      setMenuError(null);
    } catch (error) {
      const msg = error?.message || 'Error al cargar elementos del menú';
      setMenuError(msg);
      toast.error(msg);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const filtered = useMemo(() => {
    const term = search.toLowerCase().trim();
    return menuItems.filter((item) => {
      const matchesTerm = !term || [item.name, item.description].some((f) => (f || '').toLowerCase().includes(term));
      const matchesCategory = !category || item.category === category;
      return matchesTerm && matchesCategory;
    });
  }, [menuItems, search, category]);

  const set = (key) => (e) => setFormData((prev) => ({ ...prev, [key]: e.target.value }));

  const openCreate = () => {
    setEditingId(null);
    setFormData(EMPTY);
    setImagePreview('');
    setSheetOpen(true);
  };

  const handleEdit = (item) => {
    setFormData({
      restaurantId: item.restaurantId?._id || item.restaurantId || '',
      name: item.name,
      description: item.description || '',
      price: item.price,
      category: item.category || '',
      imageUrl: item.imageUrl || '',
    });
    setImagePreview(item.imageUrl || '');
    setEditingId(entityId(item));
    setSheetOpen(true);
  };

  const handleImageSelect = async (file) => {
    setIsUploadingImage(true);
    setImagePreview(URL.createObjectURL(file));
    try {
      const response = await uploadMenuImage(file);
      setFormData((prev) => ({ ...prev, imageUrl: response.imageUrl }));
      toast.success('Imagen cargada');
    } catch (error) {
      console.error(error);
      setImagePreview(formData.imageUrl || '');
      toast.error('Error al subir la imagen');
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const objectIdRegex = /^[a-fA-F0-9]{24}$/;
    if (!formData.restaurantId || !objectIdRegex.test(formData.restaurantId)) {
      toast.error('Selecciona un restaurante válido o ingresa un ID de 24 caracteres hexadecimales');
      return;
    }
    if (!formData.name || !formData.price || !formData.category) {
      toast.error('Nombre, precio y categoría son requeridos');
      return;
    }

    const payload = {
      restaurantId: formData.restaurantId,
      name: formData.name,
      description: formData.description,
      category: formData.category,
      imageUrl: formData.imageUrl,
      price: parseFloat(formData.price),
    };

    setSaving(true);
    try {
      if (editingId) {
        await updateMenuItem(editingId, payload);
        toast.success('Elemento del menú actualizado');
      } else {
        await createMenuItem(payload);
        toast.success('Elemento del menú creado');
      }
      setSheetOpen(false);
      loadMenuItems();
    } catch (error) {
      toast.error('Error al guardar elemento del menú');
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (item) => {
    const ok = await confirmAction({ title: `¿Eliminar “${item.name}”?`, description: 'Se quitará del menú.' });
    if (!ok) return;
    try {
      await deleteMenuItem(entityId(item));
      toast.success('Elemento del menú eliminado');
      loadMenuItems();
    } catch (error) {
      toast.error('Error al eliminar elemento del menú');
    }
  };

  const columns = [
    {
      key: 'name',
      header: 'Plato',
      render: (item) => (
        <div className="row" style={{ '--gap': '12px' }}>
          <span className="table__thumb">
            {item.imageUrl ? <img src={item.imageUrl} alt="" loading="lazy" /> : <ImageOff size={16} />}
          </span>
          <div className="grow">
            <p className="table__primary">{item.name}</p>
            {item.description && <p className="table__secondary line-clamp-2">{item.description}</p>}
          </div>
        </div>
      ),
    },
    {
      key: 'category',
      hideOnMobile: true,
      header: 'Categoría',
      render: (item) => (item.category ? <Badge dot={false}>{MENU_CATEGORY[item.category] || item.category}</Badge> : '—'),
    },
    {
      key: 'restaurant',
      hideOnMobile: true,
      header: 'Restaurante',
      render: (item) => <span className="text-muted nowrap">{restaurantName(item.restaurantId, restaurants)}</span>,
    },
    {
      key: 'price',
      header: 'Precio',
      align: 'right',
      render: (item) => <span className="tabular nowrap table__primary">{formatMoney(item.price)}</span>,
    },
    {
      key: 'actions',
      header: <span className="visually-hidden">Acciones</span>,
      align: 'right',
      width: 96,
      render: (item) => <RowActions label={item.name} onEdit={() => handleEdit(item)} onDelete={() => handleDelete(item)} />,
    },
  ];

  return (
    <Layout>
      <PageHeader
        eyebrow="Operación"
        title="Menú"
        description="Platos, precios y categorías de cada restaurante."
        actions={
          <Button onClick={openCreate}>
            <Plus /> Nuevo plato
          </Button>
        }
      />

      <Toolbar meta={!loading && !menuError ? `${filtered.length} platos` : null}>
        <SearchField value={search} onChange={setSearch} placeholder="Buscar plato" />
        <Select value={category} onChange={(e) => setCategory(e.target.value)} aria-label="Filtrar por categoría" className="toolbar__filter">
          <option value="">Todas</option>
          {Object.entries(MENU_CATEGORY).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </Toolbar>

      <TableCard
        loading={loading}
        error={menuError}
        onRetry={loadMenuItems}
        rows={filtered}
        columns={columns}
        caption="Elementos del menú"
        empty={{
          icon: UtensilsCrossed,
          title: search || category ? 'Sin resultados' : 'El menú está vacío',
          description: search || category ? 'Prueba con otro término o categoría.' : 'Agrega tu primer plato para empezar.',
        }}
      />

      <Sheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={editingId ? 'Editar plato' : 'Nuevo plato'}
        description="Los platos aparecen en el menú del restaurante seleccionado."
        footer={
          <>
            <Button variant="secondary" onClick={() => setSheetOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" form={FORM_ID} loading={saving} disabled={isUploadingImage}>
              {editingId ? 'Guardar cambios' : 'Crear plato'}
            </Button>
          </>
        }
      >
        <form id={FORM_ID} className="stack" onSubmit={handleSubmit}>
          <Field label="Nombre">
            {(a11y) => <Input {...a11y} value={formData.name} onChange={set('name')} placeholder="Pepián de pollo" />}
          </Field>

          {restaurants.length > 0 || restaurantsLoading ? (
            <Field label="Restaurante" hint={restaurantsLoading ? 'Cargando restaurantes…' : undefined}>
              {(a11y) => (
                <Select {...a11y} value={formData.restaurantId} onChange={set('restaurantId')} disabled={restaurantsLoading}>
                  <option value="">Seleccionar restaurante</option>
                  {restaurants.map((r) => (
                    <option key={entityId(r)} value={entityId(r)}>
                      {r.name || r.title || entityId(r)}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          ) : (
            <Field label="ID del restaurante" hint="No hay restaurantes cargados. Crea uno primero o ingresa un ID válido.">
              {(a11y) => <Input {...a11y} className="mono" value={formData.restaurantId} onChange={set('restaurantId')} />}
            </Field>
          )}

          <div className="grid-2">
            <Field label="Precio">
              {(a11y) => (
                <Input {...a11y} type="number" inputMode="decimal" step="0.01" min="0" value={formData.price} onChange={set('price')} placeholder="0.00" />
              )}
            </Field>
            <Field label="Categoría">
              {(a11y) => (
                <Select {...a11y} value={formData.category} onChange={set('category')}>
                  <option value="">Seleccionar</option>
                  {Object.entries(MENU_CATEGORY).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </Select>
              )}
            </Field>
          </div>

          <Field label="Descripción">
            {(a11y) => <Textarea {...a11y} value={formData.description} onChange={set('description')} placeholder="Ingredientes, porción…" />}
          </Field>

          <ImageDropzone
            label="Foto del plato"
            preview={imagePreview}
            uploading={isUploadingImage}
            onSelect={handleImageSelect}
            onClear={() => {
              setImagePreview('');
              setFormData((prev) => ({ ...prev, imageUrl: '' }));
            }}
          />
        </form>
      </Sheet>
    </Layout>
  );
};
