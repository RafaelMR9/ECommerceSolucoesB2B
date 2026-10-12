import Image from 'next/image'
import Brand from './Brand'

export default function AuthLayout({ title, description, children }) {
  return (
    <main className="min-h-screen grid grid-cols-[1fr_1fr] bg-white max-[850px]:grid-cols-[0.85fr_1fr] max-[600px]:grid-cols-1">
      <aside className="bg-[#15101d] relative text-white flex flex-col justify-between p-[42px] overflow-hidden max-[850px]:p-[30px] max-[600px]:p-6 max-[600px]:min-h-[185px] after:content-[''] after:absolute after:inset-0 after:bg-[linear-gradient(180deg,_#17111faa_0%,_#17111f40_35%,_#17111f_100%)]">
        <Image
          className="inset-0 w-full h-full object-cover object-[65%] opacity-[0.5] relative z-[1]"
          src="/images/brand/hero-workspace.webp"
          alt=""
          fill
          sizes="50vw"
          priority
        />
        <Brand className="inline-flex items-center gap-[9px] whitespace-nowrap text-[21px] font-extrabold tracking-[-0.8px] text-white max-[600px]:text-[18px] relative z-[1]" />
        <div className="max-w-[430px] mt-[240px] max-[600px]:mt-[25px] max-[600px]:max-w-[270px] relative z-[1]">
          <p className="font-extrabold tracking-[1.2px] normal-case mb-2.5 text-[#c1b0d1] text-ui leading-[1.8] max-[600px]:hidden">
            Seu Negócio em Movimento
          </p>
          <h2 className="text-[38px] leading-[1.17] tracking-[-1.6px] font-extrabold my-3.5 mx-0 max-[850px]:text-[31px] max-[600px]:text-[24px] max-[600px]:leading-[1.2]">
            Equipe Sua Rotina.
            <br />
            Simplifique Suas Compras.
          </h2>
          <p className="text-[#c1b0d1] text-ui leading-[1.8] max-[600px]:hidden">
            Produtos, pedidos recorrentes e atendimento para a rotina da sua organização.
          </p>
        </div>
        <p className="mt-[50px] text-caption text-[#a695b8] max-[600px]:hidden relative z-[1]">
          B2B Soluções · Projeto de portfólio
        </p>
      </aside>
      <section className="py-[45px] px-10 flex items-center justify-center max-[850px]:py-[35px] max-[850px]:px-[25px] max-[600px]:py-8 max-[600px]:px-[23px]">
        <div className="w-full max-w-[460px]">
          <p className="text-brand-accent text-caption font-extrabold tracking-[1.2px] normal-case mb-2.5">
            B2B Soluções
          </p>
          <h1 className="text-[29px] tracking-[-1px] font-extrabold max-[600px]:text-[27px]">
            {title}
          </h1>
          <p className="text-ui text-brand-muted mt-2.5 mr-0 mb-7 ml-0 leading-[1.8]">
            {description}
          </p>
          {children}
        </div>
      </section>
    </main>
  )
}
