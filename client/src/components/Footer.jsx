
import { useTranslation } from 'react-i18next';
function Footer() {
      const { t } = useTranslation();
    return (
        <footer className="bg-white dark:bg-darkblue text-slate-700 dark:text-white py-4 mt-8">
      <div className="max-w-6xl mx-auto px-4 flex justify-center items-center">
        <div className="text-sm text-slate-500 dark:text-slate-400 text-center">
          © 2024 LiveLink. {t('all_rights_reserved')}
        </div>
      </div>
    </footer>
    )
}

export default Footer
