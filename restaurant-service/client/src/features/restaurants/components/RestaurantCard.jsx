export const RestaurantCard = ({ restaurant }) => {
  return (
    <article className="restaurant-card">
      <div className="restaurant-card__header">
        <div>
          <span className={`status ${restaurant.isActive ? 'status--active' : 'status--inactive'}`}>
            {restaurant.isActive ? 'Activo' : 'Inactivo'}
          </span>
          <h3>{restaurant.name}</h3>
        </div>
        <p className="restaurant-card__hours">
          {restaurant.openingHours || 'Horario no disponible'}
        </p>
      </div>

      <p className="restaurant-card__description">
        {restaurant.description || 'Descripción no disponible'}
      </p>

      <div className="restaurant-card__info">
        <div>
          <span>Dirección</span>
          <strong>{restaurant.address}</strong>
        </div>
        <div>
          <span>Contacto</span>
          <strong>{restaurant.phone || '—'} · {restaurant.email || '—'}</strong>
        </div>
      </div>
    </article>
  );
};
