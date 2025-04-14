export default function WeatherPreview() {
    return (
      <div className="bg-gray-100 p-4 rounded text-center">
        <div className="w-24 h-24 bg-gray-300 rounded-full mx-auto mb-4" />
        <p>The description of the Weather for the day</p>
        <p className="text-sm text-gray-600">Temperature Conditions</p>
      </div>
    );
  }
  