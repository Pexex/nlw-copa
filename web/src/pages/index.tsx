import Image from 'next/image';
import appPreviewImg from '../assets/app-preview.png';
import logoImg from '../assets/logo.svg';
import usersAvatarSampleImg from '../assets/users-avatar-example.png';
import checkIconImg from '../assets/icon-check.svg';
import { api } from '../lib/axios';
import { FormEvent, useState } from 'react';

interface HomeProps {
  poolsCount: number;
  guessesCount: number;
  usersCount: number;  
}

export default function Home(props : HomeProps) {
  const [poolTitle, setPoolTitle] = useState('');
  
  async function createPool(event: FormEvent){
    event.preventDefault();

    try {
      const response = await api.post('/pools', {
        title: poolTitle,
      });

      const {code} = response.data;

      await navigator.clipboard.writeText(code);
      alert('Bolão criado com sucesso, o código foi copiado para a área de trasnferência!');

      setPoolTitle('');

    } catch(err){
      console.log(err);
      alert('falha ao criar o bolão, tente novamente!');
    }
  }

  return (
    <div className='max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28'>
      <main>
        <Image src={logoImg} alt="NLW Copa" />
        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>Crie seu próprio bolão da copa e compartilhe entre amigos!</h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvatarSampleImg} alt="vários avaters de exemplo" />
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>{props.usersCount}</span> pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className='mt-10 flex gap-2'>
          <input onChange={ event => setPoolTitle(event.target.value)} value={poolTitle} type="text" required placeholder='Qual o nome do seu bolão?' className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100' />
          <button type='submit' className='bg-yellow-500 px-6 py-4 rounded text-gray-900 text-sm uppercase hover:bg-yellow-700'>Criar meu bolão</button>
        </form>

        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>Após criar seu bolão, você receberá um código único que poderá usar para convidar outras pessoas 🚀</p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100'>
          <div className='flex items-center gap-6'>
            <Image src={checkIconImg} alt="Ícone de check" />

            <div className='flex flex-col'>
              <span className='text-2xl font-bold'>{props.poolsCount}</span>
              <span>Bolões Criados</span>
            </div>

          </div>

          <div className='w-px h-14 bg-gray-600'/>

          <div className='flex items-center gap-6'>
            <Image src={checkIconImg} alt="Ícone de check" />

            <div className='flex flex-col'>
              <span className='text-2xl font-bold'>{props.guessesCount}</span>
              <span>Palpites enviados</span>
            </div>

          </div>
        </div>
      </main>

      <Image src={appPreviewImg} alt="Dois celulares exibindo uma prévia da aplicação móvel do NLW Copa" />
    </div>
  )
}


export const getServerSideProps = async () => {

  const [poolsCountResponse, guessesCountResponse, usersCountResponse] = await Promise.all([
    api.get('pools/count'),
    api.get('guesses/count'),
    api.get('users/count'),
  ])

  return {
    props: {
      poolsCount: poolsCountResponse.data.count,
      guessesCount: guessesCountResponse.data.count,
      usersCount: usersCountResponse.data.count,
    }
  }
}
