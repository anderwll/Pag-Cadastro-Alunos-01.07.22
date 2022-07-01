import { Button, Container, Divider, Grid, IconButton, Input, Stack, Table, TableBody, TableCell, TableHead, TableRow, TextField, Typography } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import React, { useEffect, useRef, useState } from 'react'
import { couldStartTrivia } from 'typescript';

interface Aluno {
  id: number,
  nome: string,
  sobrenome: string,
  idade: number
}

/* const dados: Aluno[] = [
  {
    id: 1,
    nome: 'João',
    sobrenome: 'da Silva',
    idade: 32
  },
  {
    id: 2,
    nome: 'João',
    sobrenome: 'da Silva',
    idade: 32
  },
  {
    id: 3,
    nome: 'João',
    sobrenome: 'da Silva',
    idade: 32
  },
  {
    id: 4,
    nome: 'João',
    sobrenome: 'da Silva',
    idade: 32
  },
  {
    id: 5,
    nome: 'João',
    sobrenome: 'da Silva',
    idade: 32
  }
] */

const Home: React.FC = () => {
  const [alunos, setAlunos] = useState<Aluno[]>([])
  const [edit, setEdit] = useState(false)
  const inputNome = useRef<HTMLInputElement>(null)
  const inputSobrenome = useRef<HTMLInputElement>(null)
  const inputIdade = useRef<HTMLInputElement>(null)
  const btnAtualizar = useRef<HTMLButtonElement>(null)

  //----------------HOOKS -----------------------
  useEffect(() => {
    let listaAlunos = buscarDados();

    setAlunos(listaAlunos);
  }, [])

  useEffect(() => {
    if (!edit) {
      inputNome.current!.value = '';
      inputSobrenome.current!.value = '';
      inputIdade.current!.value = '';
    }

  }, [alunos, edit])

  // ---------------- funcoes ------------------
  function apagar(codigo: number) {
    let confirma = window.confirm(`Você deseja apagar o registro ${codigo}?`);

    if (confirma) {
      let listaAlunos = buscarDados();
      let indice = listaAlunos.findIndex((aluno) => aluno.id === codigo)

      listaAlunos.splice(indice, 1);
      setAlunos(listaAlunos);
      salvarNoStorage(listaAlunos);
    }
  }

  function editar(dadoAluno: Aluno) {
    setEdit(true)

    console.log(edit);


    inputNome.current!.value = dadoAluno.nome;
    inputSobrenome.current!.value = dadoAluno.sobrenome;
    inputIdade.current!.value = `${dadoAluno.idade}`;

    btnAtualizar.current!.addEventListener('click', () => {
      let listaAlunos = buscarDados();
      let indice = listaAlunos.findIndex((aluno) => aluno.id === dadoAluno.id)

      listaAlunos[indice] = {
        id: dadoAluno.id,
        nome: inputNome.current!.value,
        sobrenome: inputSobrenome.current!.value,
        idade: +inputIdade.current!.value
      }

      setAlunos(listaAlunos);
      salvarNoStorage(listaAlunos);
      setEdit(false);
    })

  }

  function buscarDados(): Aluno[] {
    return JSON.parse(localStorage.getItem('alunos') || '[]')
  }

  function salvarNoStorage(listaDados: Aluno[]) {
    localStorage.setItem('alunos', JSON.stringify(listaDados))
  }

  function salvarDados() {
    let listaAlunos = buscarDados();
    let maior = 1;

    if (listaAlunos.length > 0) {
      let maiorIndice = listaAlunos.reduce((acc, next) => {
        if (acc.id > next.id) {
          return acc
        }
        return next
      });

      maior = maiorIndice.id + 1
    }

    let novoAluno: Aluno = {
      id: maior,
      nome: inputNome.current!.value,
      sobrenome: inputSobrenome.current!.value,
      idade: +inputIdade.current!.value
    }

    listaAlunos.push(novoAluno);
    setAlunos(listaAlunos);
    salvarNoStorage(listaAlunos);
  }



  return (
    <Container maxWidth="md">
      <Grid container marginTop={4} marginBottom={4}>
        <Grid item xs={12}>
          <Typography align='center' variant='h3'>Cadastro de Alunos</Typography>
        </Grid>
      </Grid>
      <Divider />

      <Grid container marginTop={4} marginBottom={4} columnSpacing={1}>
        <Grid item xs={5}>
          <TextField inputRef={inputNome} id="input-nome" label="Nome" variant="outlined" focused color='success' fullWidth />
        </Grid>
        <Grid item xs={5}>
          <TextField inputRef={inputSobrenome} id="input-sobrenome" label="Sobrenome" variant="outlined" focused color='success' fullWidth />
        </Grid>
        <Grid item xs={2}>
          <TextField inputRef={inputIdade} id="input-idade" label="Idade" variant="outlined" focused color='success' fullWidth />
        </Grid>
      </Grid>
      <Stack spacing={2} direction={'row'} marginBottom={4}>

        {edit ?
          <>
            <Button variant="contained" color="primary" ref={btnAtualizar} >
              Atualizar
            </Button>

            <Button variant="contained" sx={{ display: 'none' }} color="success" onClick={salvarDados}>
              Salvar
            </Button>
          </>

          :
          <>
            <Button variant="contained" sx={{ display: 'none' }} color="primary" ref={btnAtualizar} >
              Atualizar
            </Button>

            <Button variant="contained" color="success" onClick={salvarDados}>
              Salvar
            </Button>
          </>
        }
        <Button variant="contained" color="error" onClick={() => setEdit(false)}>
          Cancelar
        </Button>
      </Stack>

      <Divider />

      <Table>
        <TableHead>
          <TableRow>
            <TableCell variant='head'>ID</TableCell>
            <TableCell variant='head'>Nome</TableCell>
            <TableCell variant='head'>Sobrenome</TableCell>
            <TableCell variant='head'>Idade</TableCell>
            <TableCell variant='head'>Ações</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {alunos.map(registro => (
            <TableRow key={registro.id}>
              <TableCell>{registro.id}</TableCell>
              <TableCell>{registro.nome}</TableCell>
              <TableCell>{registro.sobrenome}</TableCell>
              <TableCell>{registro.idade}</TableCell>
              <TableCell>
                <IconButton aria-label="delete" color="error" size="large" onClick={() => apagar(registro.id)}>
                  <DeleteIcon />
                </IconButton>
                <IconButton aria-label="edit" color="primary" size="large" onClick={() => editar(registro)}>
                  <EditIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Container>
  )
}

export default Home
