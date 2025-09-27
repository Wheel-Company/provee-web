              <div className="space-y-6">
                {workProcess.length > 0 ? workProcess.map((process, index) => {
                  const categoryColors = {
                    '청소': { bg: 'bg-blue-100', text: 'bg-blue-600' },
                    '수리': { bg: 'bg-orange-100', text: 'bg-orange-600' },
                    '과외': { bg: 'bg-green-100', text: 'bg-green-600' },
                    '디자인': { bg: 'bg-purple-100', text: 'bg-purple-600' }
                  }
                  const colors = categoryColors[expert.category?.[0] as keyof typeof categoryColors] || { bg: 'bg-gray-100', text: 'bg-gray-600' }

                  return (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-12 h-12 ${colors.bg} rounded-full flex items-center justify-center`}>
                        <span className="text-2xl">{process.icon}</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center mb-2">
                          <span className={`${colors.text} text-white text-sm font-medium px-3 py-1 rounded-full mr-3`}>
                            {process.step}단계
                          </span>
                          <h3 className="text-lg font-semibold text-gray-900">{process.title}</h3>
                        </div>
                        <p className="text-gray-600">{process.description}</p>
                      </div>
                    </div>
                  )
                }) : (
                  <div className="text-center text-gray-500 py-8">
                    작업 프로세스 정보가 없습니다.
                  </div>
                )}
              </div>