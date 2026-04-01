import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { createCar } from '../services/carsAPI'
import { getExteriorColors, getWheels, getRoofs, getEngines } from '../services/optionsAPI'
import { calculateTotalPrice, formatPrice } from '../utilities/priceCalculator'
import { validateCarConfiguration } from '../utilities/validation'
import '../App.css'

const CreateCar = () => {
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
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const [exteriorColors, wheels, roofs, engines] = await Promise.all([
          getExteriorColors(),
          getWheels(),
          getRoofs(),
          getEngines()
        ])
        setOptions({
          exteriorColors,
          wheels,
          roofs,
          engines
        })
      } catch (error) {
        console.error('Error fetching options:', error)
        setError('Failed to load customization options')
      }
    }

    fetchOptions()
  }, [])

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

      await createCar(carData)
      navigate('/customcars')
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const totalPrice = calculateTotalPrice(selectedOptions)
  const validation = validateCarConfiguration(selectedOptions)

  return (
    <div className="create-car">
      <h2>Customize Your Bolt Bucket</h2>

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

        {/* Customization Form */}
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

            <button
              type="submit"
              className="btn-primary"
              disabled={loading || !validation.isValid}
            >
              {loading ? 'Creating...' : 'Create Car'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateCar