import { execSync } from 'child_process'

type ExecError = {
  status: number
  stdout: string
}

describe('db:validate', () => {
  it('shows an error if there is an empty line at the end of the file', () => {
    try {
      execSync('DATA_DIR=tests/__data__/input/validate/empty_line npm run db:validate', {
        encoding: 'utf8'
      })
      process.exit(1)
    } catch (error) {
      expect((error as ExecError).status).toBe(1)
      expect((error as ExecError).stdout).toContain(
        'Error: empty lines at the end of file not allowed (channels.csv)'
      )
    }
  })

  it('shows an error if the number of columns in a row is incorrect', () => {
    try {
      execSync('DATA_DIR=tests/__data__/input/validate/wrong_num_cols npm run db:validate', {
        encoding: 'utf8'
      })
      process.exit(1)
    } catch (error) {
      expect((error as ExecError).status).toBe(1)
      expect((error as ExecError).stdout).toContain(
        'Error: row 2 has the wrong number of columns (categories.csv)'
      )
    }
  })

  it('shows an error if one of the lines ends with an invalid character', () => {
    try {
      execSync('DATA_DIR=tests/__data__/input/validate/invalid_line_ending npm run db:validate', {
        encoding: 'utf8'
      })
      process.exit(1)
    } catch (error) {
      expect((error as ExecError).status).toBe(1)
      expect((error as ExecError).stdout).toContain(
        'Error: row 1 has the wrong line ending character, should be CRLF (categories.csv)'
      )
    }
  })

  it('shows an error if there are duplicates in the file', () => {
    try {
      execSync('DATA_DIR=tests/__data__/input/validate/duplicate npm run db:validate', {
        encoding: 'utf8'
      })
      process.exit(1)
    } catch (error) {
      expect((error as ExecError).status).toBe(1)
      expect((error as ExecError).stdout).toContain('entry with the id "aaa" already exists')
    }
  })

  it('shows an error if an invalid value is specified', () => {
    try {
      execSync('DATA_DIR=tests/__data__/input/validate/invalid_value npm run db:validate', {
        encoding: 'utf8'
      })
      process.exit(1)
    } catch (error) {
      expect((error as ExecError).status).toBe(1)
      expect((error as ExecError).stdout).toContain('"aaa.us" is missing in the channels.csv')
      expect((error as ExecError).stdout).toContain('1 error(s)')
    }
  })

  it('does not show an error if all data are correct', () => {
    execSync('DATA_DIR=tests/__data__/input/validate/valid_data npm run db:validate', {
      encoding: 'utf8'
    })
  })
})
