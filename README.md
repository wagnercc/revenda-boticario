# Revenda Boticario

### Primeiramente, obrigado pela oportunidade

## O projeto utiliza json-server para simular uma database, leia as instruções a seguir:  

## * Instruções *
  Ao rodar o projeto, pela primeira vez, execute o comando **npm install**, após instalação dos pacotes, feche e abra novamente seu terminal.  
  **Sempre deverá rodar o comando *json-server --watch db.json* junto com a aplicação**  
  É esperado que a database fake, esteja na porta **3000**  
  
  ### Usuários
  Existem dois usuários cadastrados no sistema:  
  1- administrador  
      email: adm@boticario.com.br - senha: 1234  
  2- usuário de teste
      email: email@teste.com - senha: 4321  
  
### Funcionamento do Projeto
 1- Existe **um usuário administrador** do sistema  
 2- Este usuário administrador, é encarregado de **Aprovar ou Reprovar** os valores de cashbacks que são gerados **automaticamente** para cada compra de um usuário não administrador.  
 3- Só existe **um usuário administrador**;   
 4- O usuário não administrador, terá seu dashboard com um gráfico mostrando os cashbacks conforme foram aprovados pelo administrador  
 5- Ao ter seu cashback aprovado, o valor é disponibilizado na hora de realizar uma nova compra para o usuário.  
 6- Caso o usuário não use totalmente seu cashback, este valor restante, será salvo no novo registro de compra e os antigos, serão inativados  

##### Espero que aproveite e curta a aplicação
