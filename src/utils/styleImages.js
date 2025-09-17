export const getStyleImageUrl = (style, customStyles) => {
  if (customStyles.has(style)) {
    return customStyles.get(style)
  }

  const styleUrls = {
    'starry_night': 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ea/Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg/960px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg',
    'great_wave': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/The_Great_Wave_off_Kanagawa.jpg/960px-The_Great_Wave_off_Kanagawa.jpg',
    'the_scream': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/The_Scream.jpg/500px-The_Scream.jpg',
    'the_water_lily_pond': 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1d/The_Water-Lily_Pond_1899_Claude_Monet_Metropolitan.jpg/500px-The_Water-Lily_Pond_1899_Claude_Monet_Metropolitan.jpg',
    'girl_with_pearl_earring': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/1665_Girl_with_a_Pearl_Earring.jpg/500px-1665_Girl_with_a_Pearl_Earring.jpg',
    'the_kiss': 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg/500px-The_Kiss_-_Gustav_Klimt_-_Google_Cultural_Institute.jpg',
    'american_gothic': 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f7/Grant_Wood_-_American_Gothic_%281930%29.jpg/500px-Grant_Wood_-_American_Gothic_%281930%29.jpg',
    'birth_of_venus': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0b/Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg/960px-Sandro_Botticelli_-_La_nascita_di_Venere_-_Google_Art_Project_-_edited.jpg',
    'last_supper': 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/08/Leonardo_da_Vinci_%281452-1519%29_-_The_Last_Supper_%281495-1498%29.jpg/960px-Leonardo_da_Vinci_%281452-1519%29_-_The_Last_Supper_%281495-1498%29.jpg',
    'sunday_afternoon': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.png/960px-A_Sunday_on_La_Grande_Jatte%2C_Georges_Seurat%2C_1884.png',
    'potato_eaters': 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Vincent_van_Gogh_-_The_potato_eaters_-_Google_Art_Project_%285776925%29.jpg/960px-Vincent_van_Gogh_-_The_potato_eaters_-_Google_Art_Project_%285776925%29.jpg',
    'garden_earthly_delights': 'https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg/960px-The_Garden_of_Earthly_Delights_by_Bosch_High_Resolution.jpg',
    'hay_wain': 'https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/John_Constable_-_The_Hay_Wain_%281821%29.jpg/960px-John_Constable_-_The_Hay_Wain_%281821%29.jpg',
    'mondrian_composition': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg/500px-Piet_Mondriaan%2C_1930_-_Mondrian_Composition_II_in_Red%2C_Blue%2C_and_Yellow.jpg',
    'kandinsky_composition': 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Wassily_Kandinsky_Composition_VIII.jpg/960px-Wassily_Kandinsky_Composition_VIII.jpg',
    'christinas_world': 'https://www.moma.org/media/W1siZiIsIjE2NTQ1NyJdLFsicCIsImNvbnZlcnQiLCItcXVhbGl0eSA5MCAtcmVzaXplIDIwMDB4MTQ0MFx1MDAzZSJdXQ.jpg?sha=87dcd730f5d306a4',
    'music': 'https://whitneymedia.org/assets/artwork/7759/91_90_cropped.jpeg',
  }
  return styleUrls[style]
}

export const isValidImageUrl = (url) => {
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|bmp)(\?.*)?$/i
  return imageExtensions.test(url)
}

export const testImageLoad = (url) => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.onload = () => resolve()
    img.onerror = () => reject(new Error('Image failed to load'))
    img.src = url
  })
}