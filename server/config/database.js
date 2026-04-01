// Mock database for development
let mockData = {
  cars: [],
  exterior_colors: [
    { id: 1, name: 'Midnight Black', hex_color: '#000000', image: '/images/colors/black.png', price: 0 },
    { id: 2, name: 'Pearl White', hex_color: '#FFFFFF', image: '/images/colors/white.png', price: 500 },
    { id: 3, name: 'Crimson Red', hex_color: '#DC143C', image: '/images/colors/red.png', price: 800 },
    { id: 4, name: 'Ocean Blue', hex_color: '#000080', image: '/images/colors/blue.png', price: 600 },
    { id: 5, name: 'Forest Green', hex_color: '#228B22', image: '/images/colors/green.png', price: 700 }
  ],
  wheels: [
    { id: 1, name: 'Standard Alloy', image: '/images/wheels/standard.png', price: 0 },
    { id: 2, name: 'Sport Rims', image: '/images/wheels/sport.png', price: 1200 },
    { id: 3, name: 'Premium Chrome', image: '/images/wheels/chrome.png', price: 1800 },
    { id: 4, name: 'Off-Road Tires', image: '/images/wheels/offroad.png', price: 1500 }
  ],
  roofs: [
    { id: 1, name: 'Solid Roof', type: 'solid', image: '/images/roofs/solid.png', price: 0 },
    { id: 2, name: 'Convertible', type: 'convertible', image: '/images/roofs/convertible.png', price: 3000 }
  ],
  engines: [
    { id: 1, name: 'Base 2.0L', horsepower: 180, image: '/images/engines/base.png', price: 0 },
    { id: 2, name: 'Turbo 2.5L', horsepower: 250, image: '/images/engines/turbo.png', price: 3000 },
    { id: 3, name: 'V6 3.0L', horsepower: 320, image: '/images/engines/v6.png', price: 5000 },
    { id: 4, name: 'V8 4.0L', horsepower: 450, image: '/images/engines/v8.png', price: 8000 }
  ]
}

export const mockPool = {
  query: async (query, params = []) => {
    // Simple mock implementation
    if (query.includes('SELECT * FROM exterior_colors')) {
      return { rows: mockData.exterior_colors }
    }
    if (query.includes('SELECT * FROM wheels')) {
      return { rows: mockData.wheels }
    }
    if (query.includes('SELECT * FROM roofs')) {
      return { rows: mockData.roofs }
    }
    if (query.includes('SELECT * FROM engines')) {
      return { rows: mockData.engines }
    }
    if (query.includes('SELECT') && query.includes('(SELECT price FROM exterior_colors') && query.includes('(SELECT price FROM wheels')) {
      // Price calculation query
      const [exterior_id, wheels_id, roof_id, engine_id] = params
      const exterior_price = mockData.exterior_colors.find(c => c.id === parseInt(exterior_id))?.price || 0
      const wheels_price = mockData.wheels.find(w => w.id === parseInt(wheels_id))?.price || 0
      const roof_price = mockData.roofs.find(r => r.id === parseInt(roof_id))?.price || 0
      const engine_price = mockData.engines.find(e => e.id === parseInt(engine_id))?.price || 0
      return { rows: [{ exterior_price, wheels_price, roof_price, engine_price }] }
    }
    if (query.includes('SELECT c.*') && query.includes('FROM cars c')) {
      return { rows: mockData.cars.map(car => ({
        ...car,
        exterior_color_name: mockData.exterior_colors.find(c => c.id === car.exterior_color_id)?.name,
        hex_color: mockData.exterior_colors.find(c => c.id === car.exterior_color_id)?.hex_color,
        exterior_price: mockData.exterior_colors.find(c => c.id === car.exterior_color_id)?.price || 0,
        wheels_name: mockData.wheels.find(w => w.id === car.wheels_id)?.name,
        wheels_price: mockData.wheels.find(w => w.id === car.wheels_id)?.price || 0,
        roof_name: mockData.roofs.find(r => r.id === car.roof_id)?.name,
        roof_type: mockData.roofs.find(r => r.id === car.roof_id)?.type,
        roof_price: mockData.roofs.find(r => r.id === car.roof_id)?.price || 0,
        engine_name: mockData.engines.find(e => e.id === car.engine_id)?.name,
        horsepower: mockData.engines.find(e => e.id === car.engine_id)?.horsepower,
        engine_price: mockData.engines.find(e => e.id === car.engine_id)?.price || 0
      })) }
    }
    if (query.includes('INSERT INTO cars')) {
      const [name, exterior_color_id, wheels_id, roof_id, engine_id, total_price] = params
      const newCar = {
        id: mockData.cars.length + 1,
        name,
        base_price: 25000,
        exterior_color_id,
        wheels_id,
        roof_id,
        engine_id,
        total_price,
        created_at: new Date().toISOString()
      }
      mockData.cars.push(newCar)
      return { rows: [newCar] }
    }
    if (query.includes('SELECT c.* FROM cars c WHERE c.id = $1')) {
      const [id] = params
      const car = mockData.cars.find(c => c.id === parseInt(id))
      if (!car) return { rows: [] }
      return { rows: [{
        ...car,
        exterior_color_name: mockData.exterior_colors.find(c => c.id === car.exterior_color_id)?.name,
        hex_color: mockData.exterior_colors.find(c => c.id === car.exterior_color_id)?.hex_color,
        exterior_price: mockData.exterior_colors.find(c => c.id === car.exterior_color_id)?.price || 0,
        wheels_name: mockData.wheels.find(w => w.id === car.wheels_id)?.name,
        wheels_price: mockData.wheels.find(w => w.id === car.wheels_id)?.price || 0,
        roof_name: mockData.roofs.find(r => r.id === car.roof_id)?.name,
        roof_type: mockData.roofs.find(r => r.id === car.roof_id)?.type,
        roof_price: mockData.roofs.find(r => r.id === car.roof_id)?.price || 0,
        engine_name: mockData.engines.find(e => e.id === car.engine_id)?.name,
        horsepower: mockData.engines.find(e => e.id === car.engine_id)?.horsepower,
        engine_price: mockData.engines.find(e => e.id === car.engine_id)?.price || 0
      }] }
    }
    if (query.includes('UPDATE cars')) {
      const [name, exterior_color_id, wheels_id, roof_id, engine_id, total_price, id] = params
      const carIndex = mockData.cars.findIndex(c => c.id === parseInt(id))
      if (carIndex === -1) return { rows: [] }
      mockData.cars[carIndex] = {
        ...mockData.cars[carIndex],
        name,
        exterior_color_id: parseInt(exterior_color_id),
        wheels_id: parseInt(wheels_id),
        roof_id: parseInt(roof_id),
        engine_id: parseInt(engine_id),
        total_price: parseFloat(total_price)
      }
      return { rows: [mockData.cars[carIndex]] }
    }
    if (query.includes('DELETE FROM cars')) {
      const [id] = params
      const carIndex = mockData.cars.findIndex(c => c.id === parseInt(id))
      if (carIndex === -1) return { rows: [] }
      const deletedCar = mockData.cars.splice(carIndex, 1)[0]
      return { rows: [deletedCar] }
    }
    return { rows: [] }
  },
  end: () => {}
}

// For compatibility, export as pool
export const pool = mockPool