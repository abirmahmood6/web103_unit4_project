import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllCars, deleteCar } from '../services/carsAPI'
import { formatPrice } from '../utilities/priceCalculator'
import '../App.css'

const ViewCars = () => {
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  useEffect(() => {
    fetchCars()
  }, [])

  const fetchCars = async () => {
    try {
      setLoading(true)
      const carsData = await getAllCars()
      setCars(carsData)
    } catch (error) {
      setError('Failed to load cars')
      console.error('Error fetching cars:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteCar(id)
      setCars(cars.filter(car => car.id !== id))
      setDeleteConfirm(null)
    } catch (error) {
      setError('Failed to delete car')
      console.error('Error deleting car:', error)
    }
  }

  if (loading) {
    return <div className="loading">Loading your custom cars...</div>
  }

  if (error) {
    return <div className="error-message">{error}</div>
  }

  return (
    <div className="view-cars">
      <h2>Your Custom Cars</h2>

      {cars.length === 0 ? (
        <div className="no-cars">
          <p>You haven't created any custom cars yet.</p>
          <Link to="/" className="btn-primary">Create Your First Car</Link>
        </div>
      ) : (
        <div className="cars-grid">
          {cars.map(car => (
            <div key={car.id} className="car-card">
              <div
                className="car-preview-small"
                style={{
                  backgroundColor: car.hex_color || '#cccccc'
                }}
              >
                <div className="car-body-small"></div>
              </div>

              <div className="car-info">
                <h3>{car.name}</h3>
                <div className="car-specs">
                  <p><strong>Color:</strong> {car.exterior_color_name}</p>
                  <p><strong>Wheels:</strong> {car.wheels_name}</p>
                  <p><strong>Roof:</strong> {car.roof_name}</p>
                  <p><strong>Engine:</strong> {car.engine_name} ({car.horsepower} HP)</p>
                  <p className="price">{formatPrice(car.total_price)}</p>
                </div>

                <div className="car-actions">
                  <Link to={`/customcars/${car.id}`} className="btn-secondary">View Details</Link>
                  <Link to={`/edit/${car.id}`} className="btn-secondary">Edit</Link>
                  <button
                    className="btn-danger"
                    onClick={() => setDeleteConfirm(car.id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Delete</h3>
            <p>Are you sure you want to delete this car? This action cannot be undone.</p>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Cancel
              </button>
              <button
                className="btn-danger"
                onClick={() => handleDelete(deleteConfirm)}
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

export default ViewCars