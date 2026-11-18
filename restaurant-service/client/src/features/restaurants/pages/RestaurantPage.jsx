import { useEffect, useMemo, useState } from 'react';
import { Plus, Store } from 'lucide-react';
import { toast } from 'sonner';
import { Layout } from '../../../shared/components/Layout.jsx';
import { PageHeader } from '../../../shared/components/ui/PageHeader.jsx';
import { Button } from '../../../shared/components/ui/Button.jsx';
import { Card } from '../../../shared/components/ui/Card.jsx';
import { Sheet } from '../../../shared/components/ui/Sheet.jsx';
import { Skeleton } from '../../../shared/components/ui/Skeleton.jsx';
import { EmptyState, ErrorState } from '../../../shared/components/ui/EmptyState.jsx';
import { SearchField, Toolbar } from '../../../shared/components/ui/SearchField.jsx';
import { RestaurantCard } from '../components/RestaurantCard.jsx';
import { RestaurantForm, EMPTY_RESTAURANT } from '../components/RestaurantForm.jsx';
import { confirmAction } from '../../../shared/lib/confirm.js';
import {
  getAllRestaurants,
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  uploadRestaurantImage,
} from '../../../shared/api/restaurantApi.js';

const FORM_ID = 'restaurant-form';

export const RestaurantPage = () => {
  const [restaurants, setRestaurants] = useState([]);
  const [search, setSearch] = useState('');
  const [sheetOpen, setSheetOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [restaurantsError, setRestaurantsError] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState(EMPTY_RESTAURANT);

  const filteredRestaurants = useMemo(() => {
    const term = search.toLowerCase().trim();
    if (!term) return restaurants;
    return restaurants.filter((r) =>
      [r.name, r.address, r.description].some((field) => (field || '').toLowerCase().includes(term))
    );
  }, [restaurants, search]);

  const loadRestaurants = async () => {
    setIsLoading(true);
    try {
      const data = await getAllRestaurants();
      setRestaurants(Array.isArray(data) ? data : []);
      setRestaurantsError(null);
    } catch (error) {
      const msg = error?.message || 'No se pudieron cargar los restaurantes.';
      setRestaurantsError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadRestaurants();
  }, []);

  const openCreate = () => {
    setEditingId(null);
    setFormData(EMPTY_RESTAURANT);
    setImagePreview('');
    setSheetOpen(true);
  };

  const handleEdit = (restaurant) => {
    setFormData({
      name: restaurant.name || '',
      address: restaurant.address || '',
      description: restaurant.description || '',
      phone: restaurant.phone || '',
      imageUrl: restaurant.imageUrl || '',
    });
    setImagePreview(restaurant.imageUrl || '');
    setEditingId(restaurant.id || restaurant._id);
    setSheetOpen(true);
  };

  const handleImageSelect = async (file) => {
    setIsUploadingImage(true);
    setImagePreview(URL.createObjectURL(file));
    try {
      const response = await uploadRestaurantImage(file);
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
    if (!formData.name.trim()) {
      toast.error('El nombre es requerido');
      return;
    }

    setSaving(true);
    try {
      if (editingId) {
        await updateRestaurant(editingId, formData);
        toast.success('Restaurante actualizado');
      } else {
        await createRestaurant(formData);
        toast.success('Restaurante agregado');
      }
      setSheetOpen(false);
      loadRestaurants();
    } catch (error) {
      toast.error(error.message || 'Error al guardar el restaurante');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const ok = await confirmAction({
      title: '¿Eliminar este restaurante?',
      description: 'Esta acción no se puede deshacer.',
    });
    if (!ok) return;
    try {
      await deleteRestaurant(id);
      toast.success('Restaurante eliminado');
      loadRestaurants();
    } catch (error) {
      toast.error('Error al eliminar el restaurante');
    }
  };

  const handleCopyId = async (restaurantId) => {
    try {
      await navigator.clipboard.writeText(restaurantId);
      toast.success('ID copiado al portapapeles');
    } catch (error) {
      toast.error('No se pudo copiar el ID');
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="restaurant-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} padded={false} className="stack" style={{ '--gap': '0' }}>
              <Skeleton height={140} radius={0} />
              <div className="stack" style={{ padding: 16, '--gap': '10px' }}>
                <Skeleton width="60%" height={16} />
                <Skeleton width="90%" />
                <Skeleton width="40%" />
              </div>
            </Card>
          ))}
        </div>
      );
    }
    if (restaurantsError) {
      return (
        <Card>
          <ErrorState title="Error al cargar restaurantes" message={restaurantsError} onRetry={loadRestaurants} />
        </Card>
      );
    }
    if (filteredRestaurants.length === 0) {
      return (
        <Card>
          {search ? (
            <EmptyState
              icon={Store}
              title="Sin resultados"
              description={`No encontramos restaurantes que coincidan con “${search}”.`}
              action={
                <Button variant="secondary" size="sm" onClick={() => setSearch('')}>
                  Limpiar búsqueda
                </Button>
              }
            />
          ) : (
            <EmptyState
              icon={Store}
              title="Aún no hay restaurantes"
              description="Crea tu primer local para empezar a gestionar menú, órdenes y reservaciones."
              action={
                <Button size="sm" onClick={openCreate}>
                  <Plus /> Nuevo restaurante
                </Button>
              }
            />
          )}
        </Card>
      );
    }
    return (
      <div className="restaurant-grid">
        {filteredRestaurants.map((restaurant, index) => (
          <RestaurantCard
            key={restaurant.id || restaurant._id}
            restaurant={restaurant}
            index={index}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onCopyId={handleCopyId}
          />
        ))}
      </div>
    );
  };

  return (
    <Layout>
      <PageHeader
        eyebrow="Operación"
        title="Restaurantes"
        description="Gestiona tus locales, su información y datos de contacto."
        actions={
          <Button onClick={openCreate}>
            <Plus /> Nuevo restaurante
          </Button>
        }
      />

      <Toolbar
        meta={!isLoading && !restaurantsError ? `${filteredRestaurants.length} de ${restaurants.length}` : null}
      >
        <SearchField value={search} onChange={setSearch} placeholder="Buscar por nombre, dirección o descripción" />
      </Toolbar>

      {renderContent()}

      <Sheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        title={editingId ? 'Editar restaurante' : 'Nuevo restaurante'}
        description={editingId ? 'Actualiza la información del local.' : 'Completa los datos del nuevo local.'}
        footer={
          <>
            <Button variant="secondary" onClick={() => setSheetOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" form={FORM_ID} loading={saving} disabled={isUploadingImage}>
              {editingId ? 'Guardar cambios' : 'Crear restaurante'}
            </Button>
          </>
        }
      >
        <RestaurantForm
          id={FORM_ID}
          value={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          imagePreview={imagePreview}
          uploading={isUploadingImage}
          onImageSelect={handleImageSelect}
          onImageClear={() => {
            setImagePreview('');
            setFormData((prev) => ({ ...prev, imageUrl: '' }));
          }}
        />
      </Sheet>
    </Layout>
  );
};
