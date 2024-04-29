import type { Config } from 'jest'
import nextJest from 'next/jest.js'
 
const createJestConfig = nextJest({
    dir: './',
})
 
const config: Config = {
    coverageProvider: 'v8',
    testEnvironment: 'jsdom',
    preset: "ts-jest",
    setupFilesAfterEnv: [
      "<rootDir>tests/config/setupTests.ts"
    ],
    moduleNameMapper: {
      "\\.(css|scss)$": "<rootDir>/tests/config/styleMock.ts"
    }
}
 
// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
export default createJestConfig(config)