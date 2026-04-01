import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCarById, updateCar } from '../services/carsAPI'
import { getExteriorColors, getWheels, getRoofs, getEngines } from '../services/optionsAPI'
import { calculateTotalPrice, formatPrice } from '../utilities/priceCalculator'
import { validateCarConfiguration } from '../utilities/validation'
import '../App.css'

const EditCar = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [carName, setCarName] = useState('')
  const [selectedOptions, setSelectedOptions] = useState({
    exteriorColor: null,
    wheels: null,
    roof: null,
    engine: null
  })
  const [options, setOptions] = useState({
    exteriorColors: [],
    wheels: [],
    roofs: [],
    engines: []
  })
  const [loading, setLoading] = useState(false)
  const [fetchLoading, setFetchLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [carData, exteriorColors, wheels, roofs, engines] = await Promise.all([
          getCarById(id),
          getExteriorColors(),
          getWheels(),
          getRoofs(),
          getEngines()
        ])

        setCarName(carData.name)
        setSelectedOptions({
          exteriorColor: {
            id: carData.exterior_color_id,
            name: carData.exterior_color_name,
            hex_color: carData.hex_color,
            price: carData.exterior_price
          },
          wheels: {
            id: carData.wheels_id,
            name: carData.wheels_name,
            price: carData.wheels_price
          },
          roof: {
            id: carData.roof_id,
            name: carData.roof_name,
            type: carData.roof_type,
            price: carData.roof_price
          },
          engine: {
            id: carData.engine_id,
            name: carData.engine_name,
            horsepower: carData.horsepower,
            price: carData.engine_price
          }
        })

        setOptions({
          exteriorColors,
          wheels,
          roofs,
          engines
        })
      } catch (error) {
        console.error('Error fetching data:', error)
        setError('Failed to load car data')
      } finally {
        setFetchLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleOptionChange = (category, option) => {
    setSelectedOptions(prev => ({
      ...prev,
      [category]: option
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!carName.trim()) {
      setError('Please enter a name for your car')
      return
    }

    const validation = validateCarConfiguration(selectedOptions)
    if (!validation.isValid) {
      setError(validation.error)
      return
    }

    // Check if all options are selected
    const { exteriorColor, wheels, roof, engine } = selectedOptions
    if (!exteriorColor || !wheels || !roof || !engine) {
      setError('Please select all customization options')
      return
    }

    setLoading(true)
    setError('')

    try {
      const carData = {
        name: carName.trim(),
        exterior_color_id: exteriorColor.id,
        wheels_id: wheels.id,
        roof_id: roof.id,
        engine_id: engine.id
      }

      await updateCar(id, carData)
      navigate(`/customcars/${id}`)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetchLoading) {
    return <div className="loading">Loading car data...</div>
  }

  const totalPrice = calculateTotalPrice(selectedOptions)
  const validation = validateCarConfiguration(selectedOptions)

  return (
    <div className="edit-car">
      <h2>Edit Your Car</h2>

      <div className="customizer-container">
        {/* Car Preview */}
        <div className="car-preview">
          <div
            className="car-body"
            style={{
              backgroundColor: selectedOptions.exteriorColor?.hex_color || '#cccccc'
            }}
          >
            <div className="car-roof"></div>
            <div className="car-windows"></div>
            <div className="car-wheels">
              <div className="wheel front-left"></div>
              <div className="wheel front-right"></div>
              <div className="wheel rear-left"></div>
              <div className="wheel rear-right"></div>
            </div>
          </div>
          <div className="car-details">
            <h3>{carName || 'My Custom Car'}</h3>
            <p className="price">{formatPrice(totalPrice)}</p>
          </div>
        </div>

        {/* Edit Form */}
        <div className="customization-form">
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="carName">Car Name:</label>
              <input
                type="text"
                id="carName"
                value={carName}
                onChange={(e) => setCarName(e.target.value)}
                placeholder="Enter your car's name"
                required
              />
            </div>

            {/* Exterior Color */}
            <div className="option-group">
              <h3>Exterior Color</h3>
              <div className="options-grid">
                {options.exteriorColors.map(color => (
                  <div
                    key={color.id}
                    className={`option-card ${selectedOptions.exteriorColor?.id === color.id ? 'selected' : ''}`}
                    onClick={() => handleOptionChange('exteriorColor', color)}
                  >
                    <div
                      className="color-swatch"
                      style={{ backgroundColor: color.hex_color }}
                    ></div>
                    <p>{color.name}</p>
                    <p className="price">{color.price > 0 ? `+${formatPrice(color.price)}` : 'Included'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Wheels */}
            <div className="option-group">
              <h3>Wheels</h3>
              <div className="options-grid">
                {options.wheels.map(wheel => (
                  <div
                    key={wheel.id}
                    className={`option-card ${selectedOptions.wheels?.id === wheel.id ? 'selected' : ''}`}
                    onClick={() => handleOptionChange('wheels', wheel)}
                  >
                    <div className="wheel-preview">
                      <img src={wheel.image} alt={wheel.name} />
                    </div>
                    <p>{wheel.name}</p>
                    <p className="price">{wheel.price > 0 ? `+${formatPrice(wheel.price)}` : 'Included'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Roof */}
            <div className="option-group">
              <h3>Roof Design</h3>
              <div className="options-grid">
                {options.roofs.map(roof => (
                  <div
                    key={roof.id}
                    className={`option-card ${selectedOptions.roof?.id === roof.id ? 'selected' : ''}`}
                    onClick={() => handleOptionChange('roof', roof)}
                  >
                    <div className="roof-preview">
                      <img src={roof.image} alt={roof.name} />
                    </div>
                    <p>{roof.name}</p>
                    <p className="price">{roof.price > 0 ? `+${formatPrice(roof.price)}` : 'Included'}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Engine */}
            <div className="option-group">
              <h3>Engine</h3>
              <div className="options-grid">
                {options.engines.map(engine => (
                  <div
                    key={engine.id}
                    className={`option-card ${selectedOptions.engine?.id === engine.id ? 'selected' : ''}`}
                    onClick={() => handleOptionChange('engine', engine)}
                  >
                    <div className="engine-preview">
                      <img src={engine.image} alt={engine.name} />
                    </div>
                    <p>{engine.name}</p>
                    <p className="specs">{engine.horsepower} HP</p>
                    <p className="price">{engine.price > 0 ? `+${formatPrice(engine.price)}` : 'Included'}</p>
                  </div>
                ))}
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {!validation.isValid && <div className="warning-message">{validation.error}</div>}

            <div className="form-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => navigate(`/customcars/${id}`)}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
                disabled={loading || !validation.isValid}
              >
                {loading ? 'Updating...' : 'Update Car'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default EditCar