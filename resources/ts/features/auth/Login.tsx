import React, { FormEvent, useState } from 'react'
import {
  createStyles,
  makeStyles,
  Theme,
  useTheme
} from '@material-ui/core/styles'
import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import CircularProgress from '@material-ui/core/CircularProgress'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Paper from '@material-ui/core/Paper'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import useMediaQuery from '@material-ui/core/useMediaQuery'
import Alert from '@material-ui/lab/Alert'
import { useSnackbar } from 'notistack'

import { useAuth } from './useAuth'
import { APIError, NetworkError, ValidationError } from '../../errors'

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginContainer: {
      alignItems: 'center',
      backgroundColor: theme.palette.background.default,
      display: 'flex',
      justifyContent: 'center',
      minHeight: '100vh',
      [theme.breakpoints.down('xs')]: {
        backgroundColor: theme.palette.background.paper,
      },
    },
    loginPanel: {
      flexGrow: 1,
      margin: theme.spacing(2),
      maxWidth: '420px',
      padding: theme.spacing(5),
      [theme.breakpoints.down('xs')]: {
        padding: theme.spacing(5, 2),
      },
    },
    title: {
      marginBottom: theme.spacing(1),
      textAlign: 'center',
    },
    textField: {
      marginTop: theme.spacing(2),
      width: '100%',
    },
    checkboxField: {
      margin: theme.spacing(1, 0),
    },
    errors: {
      margin: theme.spacing(4, 0, 2),
    },
    alert: {
      marginTop: theme.spacing(1),
    },
  }),
)

export const Login: React.VFC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<string[]>([])

  const { login } = useAuth()

  const classes = useStyles()
  const theme = useTheme()
  const matches = useMediaQuery(theme.breakpoints.down('xs'))
  const { enqueueSnackbar } = useSnackbar()

  const canLogin = Boolean(!isLoading && email && password)

  const onLoginAttempt = async (e: FormEvent) => {
    e.preventDefault()

    if (!canLogin) {
      return
    }

    setIsLoading(true)
    try {
      await login(email, password, remember)
      enqueueSnackbar('ログインに成功しました')
    } catch (e) {
      if (e instanceof NetworkError) {
        setErrors(['ネットワークに接続されていません。'])
      } else if (e instanceof ValidationError) {
        const messages: string[] = []

        if (e.messages.auth) {
          setErrors(['メールアドレスまたはパスワードが間違っています。'])
        } else {
          if (Array.isArray(e.messages.email)
              && e.messages.email.length > 0) {
            messages.push(e.messages.email[0])
          }
          if (Array.isArray(e.messages.password)
              && e.messages.password.password.length > 0) {
            messages.push(e.messages.password[0])
          }
          setErrors(messages)
        }
      } else if (e instanceof APIError) {
        setErrors(['サーバーエラーが発生しました。時間をおいてもう一度お試しください。'])
      }
      setIsLoading(false)
    }
  }

  return (
    <div className={classes.loginContainer}>
      <Paper className={classes.loginPanel} elevation={matches ? 0 : 1}>
        <Typography variant="h4" component="h1" className={classes.title}>
          Uno Catalog
        </Typography>
        {errors.length > 0 &&
          <div className={classes.errors}>
            {errors.map(error => (
              <Alert
                key={error}
                severity="error"
                className={classes.alert}
              >
                {error}
              </Alert>
            ))}
          </div>}
        <form onSubmit={onLoginAttempt}>
          <TextField
            label="メールアドレス"
            variant="filled"
            type="email"
            required
            className={classes.textField}
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <TextField
            label="パスワード"
            variant="filled"
            type="password"
            required
            className={classes.textField}
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <FormControlLabel
            control={
              <Checkbox
                color="primary"
                checked={remember}
                onChange={e => setRemember(e.target.checked)}
              />
            }
            label="継続してログインする"
            className={classes.checkboxField}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={!canLogin}
          >
            {isLoading
              ? (<>
                  <Typography variant="srOnly">ログイン中</Typography>
                  <CircularProgress size={24} />
                </>)
              : 'ログイン'}
          </Button>
        </form>
      </Paper>
    </div>
  )
}
