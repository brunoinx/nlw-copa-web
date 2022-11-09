import { FormEvent, useState } from "react";
import Image from "next/image";

import appPreviewImg from "assets/app-nlw-copa-preview.png";
import logoImg from "assets/logo.svg";
import usersAvatarExampleImg from "assets/users-avatar-example.png";
import iconCheckImg from "assets/icon-check.svg";
import { api } from "lib/axios";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home({ poolCount, guessCount, userCount }: HomeProps) {
  const [poolTitle, setPoolTitle] = useState("");

  async function handleCreatePool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post("/pools", {
        title: poolTitle,
      });

      const { code } = response.data;

      await navigator.clipboard.writeText(code);

      alert(
        "Seu bolão foi criado com sucesso! O código do mesmo foi adicionado a sua área de transferência."
      );

      setPoolTitle("");
    } catch (error) {
      console.log(error);
      alert("Erro ao cadastrar o bolão. Tente novamente.");
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 gap-28 items-center">
      <main>
        <Image src={logoImg} alt="NLW Copa" quality={100} />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>

        <div className="mt-10 flex items-center">
          <Image src={usersAvatarExampleImg} alt="" />

          <strong className="ml-2 font-bold text-gray-100 text-xl">
            <span className="text-ignite-500">+ {userCount} </span>
            pessoas já estão usando
          </strong>
        </div>

        <form onSubmit={handleCreatePool} className="mt-10 mb-4 flex gap-2">
          <input
            className="flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-gray-100"
            type="text"
            placeholder="Qual o nome do seu bolão?"
            value={poolTitle}
            onChange={(e) => setPoolTitle(e.target.value)}
          />
          <button
            type="submit"
            className="bg-ctYellow-500 px-6 py-4 rounded font-bold text-sm uppercase hover:bg-yellow-500"
          >
            Criar meu Bolão
          </button>
        </form>

        <p className="text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas 🚀
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600">
          <div className="grid grid-cols-2 divide-x divide-gray-600">
            <div className="flex items-center">
              <Image
                src={iconCheckImg}
                alt="Circulo verde com um check branco no centro"
              />
              <div className="flex flex-col text-gray-100 ml-6">
                <span className="text-2xl font-bold mb-[2px]">
                  + {poolCount}
                </span>
                <span>bolões criados</span>
              </div>
            </div>

            <div className="flex items-center justify-end">
              <Image
                src={iconCheckImg}
                alt="Circulo verde com um check branco no centro"
              />
              <div className="flex flex-col text-gray-100 ml-6">
                <span className="text-2xl font-bold mb-[2px]">
                  + {guessCount}
                </span>
                <span>palpites enviados</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Image
        src={appPreviewImg}
        alt="Dois celulares com imagem de preview do projeto mobile."
        quality={100}
      />
    </div>
  );
}

export async function getServerSideProps() {
  const [poolCountResponse, guessCountResponse, userCountResponse] =
    await Promise.all([
      api.get("pools/count"),
      api.get("guesses/count"),
      api.get("users/count"),
    ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: userCountResponse.data.count,
    },
  };
}
