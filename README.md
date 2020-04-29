# RevendaBoticario

### Primeiramente, obrigado pela oportunidade

## O projeto utiliza json-server para simular uma database, leia as instruções a seguir:  

## * Instruções *
  Ao rodar o projeto, sempre deverá rodar também o comando **json-server --watch db.json**  
  É esperado que a database fake, esteja na porta **3000**  
O projeto funciona da seguinte forma:  
 1- Existe **um usuário administrador** do sistema  
 2- Este usuário administrador, é encarregado de **Aprovar ou Reprovar** os valores de cashbacks que são gerados **automaticamente** para cada compra de um usuário não administrador.  
 3- Só existe **um usuário administrador** - dados de acesso: adm@boticario.com.br senha: 1234;  
 4- O usuário não administrador, terá seu dashboard com um gráfico mostrando os cashbacks conforme foram aprovados pelo administrador  
 5- Ao ter seu cashback aprovado, o valor é disponibilizado na hora de realizar uma nova compra para o usuário.  
 6- Caso o usuário não use totalmente seu cashback, este valor restante, será salvo no novo registro de compra e os antigos, serão inativados  

##### Espero que aproveite e curta a aplicação
