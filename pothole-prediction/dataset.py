from torch.utils.data import DataLoader
import torchvision.transforms as transforms
from torchvision import datasets


class PrepareDataset:
    def __init__(self,train_path,test_path,train_transform=None,test_transform=None,BATCH_SIZE=32, NUM_WORKERS=1):
        """
        Args:
            train_path (str): Path to the training dataset directory.
            test_path (str): Path to the testing dataset directory.
            train_transform (callable, optional): Transformations for the training dataset.
            test_transform (callable, optional): Transformations for the testing dataset.
            BATCH_SIZE (int, optional): Batch size for DataLoader. Default is 32.
            NUM_WORKERS (int, optional): Number of workers for DataLoader. Default is 1.

        Example:
            dataset = PrepareDataset(train_path='data/train', test_path='data/test')
            train_loader, test_loader = dataset.get_dataloaders()

        """


        self.train_path = train_path
        self.test_path = test_path
        self.BATCH_SIZE = BATCH_SIZE
        self.NUM_WORKERS = NUM_WORKERS

        if train_transform is None:
            self.train_transform = transforms.Compose([
                transforms.RandomResizedCrop(128),
                transforms.TrivialAugmentWide(num_magnitude_bins=5),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                    std=[0.229, 0.224, 0.225])
            ])
        else:
            self.train_transform = train_transform

        if test_transform is None:
            self.test_transform = transforms.Compose([
                transforms.Resize(128),
                transforms.CenterCrop(128),
                transforms.ToTensor(),
                transforms.Normalize(mean=[0.485, 0.456, 0.406],
                                    std=[0.229, 0.224, 0.225])
            ])
        else:
            self.test_transform = test_transform
            
    def _create_datasets(self):
        train_dataset = datasets.ImageFolder(root=self.train_path,
                                                    transform = self.train_transform)

        test_dataset = datasets.ImageFolder(root=self.test_path,
                                                transform = self.test_transform)
        return train_dataset, test_dataset


    def get_dataloaders(self):
        train_dataset, test_dataset = self._create_datasets()
        train_dataloader = DataLoader(dataset=train_dataset,
                                    batch_size = self.BATCH_SIZE,
                                    shuffle = True,
                                    num_workers = self.NUM_WORKERS)

        test_dataloader = DataLoader(dataset=test_dataset,
                                    batch_size = self.BATCH_SIZE,
                                    shuffle = False,
                                    num_workers = self.NUM_WORKERS)
        
        return train_dataloader, test_dataloader