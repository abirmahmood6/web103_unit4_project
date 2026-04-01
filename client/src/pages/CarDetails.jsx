import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getCarById, deleteCar } from '../services/carsAPI'
import { formatPrice } from '../utilities/priceCalculator'
import '../App.css'

const CarDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(false)

  useEffect(() => {
    fetchCar()
  }, [id])

  const fetchCar = async () => {
    try {
      setLoading(true)
      const carData = await getCarById(id)
      setCar(carData)
    } catch (error) {
      setError('Failed to load car details')
      console.error('Error fetching car:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    try {
      await deleteCar(id)
      navigate('/customcars')
    } catch (error) {
      setError('Failed to delete car')
      console.error('Error deleting car:', error)
    }
  }

  if (loading) {
    return <div className="loading">Loading car details...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  if (!car) {
    return <div className="error-message">Car not found</div>
  }

  return (
    <div className="car-details">
      <div className="car-header">
        <h2>{car.name}</h2>
        <div className="car-actions">
          <Link to={`/edit/${car.id}`} className="btn-secondary">Edit Car</Link>
          <button
            className="btn-danger"
            onClick={() => setDeleteConfirm(true)}
          >
            Delete Car
          </button>
        </div>
      </div>

      <div className="car-details-container">
        {/* Car Visualization */}
        <div className="car-visualization">
          <div
            className="car-body-large"
            style={{
              backgroundColor: car.hex_color || '#cccccc'
            }}
          >
            <div className="car-roof-large"></div>
            <div className="car-windows-large"></div>
            <div className="car-wheels-large">
              <div className="wheel-large front-left"></div>
              <div className="wheel-large front-right"></div>
              <div className="wheel-large rear-left"></div>
              <div className="wheel-large rear-right"></div>
            </div>
          </div>
        </div>

        {/* Car Specifications */}
        <div className="car-specs-detailed">
          <div className="price-display">
            <h3>Total Price</h3>
            <p className="total-price">{formatPrice(car.total_price)}</p>
          </div>

          <div className="specs-list">
            <div className="spec-item">
              <h4>Exterior Color</h4>
              <div className="spec-content">
                <div
                  className="color-indicator"
                  style={{ backgroundColor: car.hex_color }}
                ></div>
                <div>
                  <p className="spec-name">{car.exterior_color_name}</p>
                  <p className="spec-price">
                    {car.exterior_price > 0 ? `+${formatPrice(car.exterior_price)}` : 'Included'}
                  </p>
                </div>
              </div>
            </div>

            <div className="spec-item">
              <h4>Wheels</h4>
              <div className="spec-content">
                <div className="wheel-indicator"></div>
                <div>
                  <p className="spec-name">{car.wheels_name}</p>
                  <p className="spec-price">
                    {car.wheels_price > 0 ? `+${formatPrice(car.wheels_price)}` : 'Included'}
                  </p>
                </div>
              </div>
            </div>

            <div className="spec-item">
              <h4>Roof Design</h4>
              <div className="spec-content">
                <div className="roof-indicator"></div>
                <div>
                  <p className="spec-name">{car.roof_name}</p>
                  <p className="spec-type">{car.roof_type}</p>
                  <p className="spec-price">
                    {car.roof_price > 0 ? `+${formatPrice(car.roof_price)}` : 'Included'}
                  </p>
                </div>
              </div>
            </div>

            <div className="spec-item">
              <h4>Engine</h4>
              <div className="spec-content">
                <div className="engine-indicator"></div>
                <div>
                  <p className="spec-name">{car.engine_name}</p>
                  <p className="spec-power">{car.horsepower} HP</p>
                  <p className="spec-price">
                    {car.engine_price > 0 ? `+${formatPrice(car.engine_price)}` : 'Included'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="base-price-info">
            <p><strong>Base Price:</strong> {formatPrice(car.base_price)}</p>
            <p><strong>Customizations:</strong> {formatPrice(car.total_price - car.base_price)}</p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete "{car.name}"? This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setDeleteConfirm(false)}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={handleDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default CarDetails