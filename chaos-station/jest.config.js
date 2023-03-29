module.exports = {
  collectCoverage: true,
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    './src/**/*.ts'
  ],
  coverageReporters: [
    'lcov', 'json', 'text'
  ],
  moduleFileExtensions: [
    'ts',
    'js'
  ],
  transform: {
    '^.+\\.ts$': [
      'ts-jest',
      {
        tsconfig: 'spec/tsconfig.json'
      }
    ]
  },
  testMatch: [
    '<rootDir>/spec/**/*Spec.ts'
  ],
  testEnvironment: '<rootDir>/spec/__helper/akashic-environment.js',
  setupFilesAfterEnv: ['<rootDir>/spec/__helper/launch.ts']
}
