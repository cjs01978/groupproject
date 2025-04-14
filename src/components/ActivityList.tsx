export default function ActivityList() {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex bg-gray-100 p-4 rounded">
            <div className="w-24 h-24 bg-gray-300 mr-4" />
            <div>
              <h3 className="font-semibold text-lg">Activity Title</h3>
              <p className="text-sm text-gray-600">Description of activity</p>
            </div>
          </div>
        ))}
      </div>
    );
  }
  